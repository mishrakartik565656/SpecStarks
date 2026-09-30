-- CleanSetu Supabase Schema

-- Profiles table (extends Supabase Auth users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('Citizen', 'Worker', 'Admin')),
  area TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL,
  description TEXT,
  before_photo_url TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  status TEXT DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'Verified', 'Rejected', 'Assigned', 'In Progress', 'Cleanup Submitted', 'Resolved', 'Reassigned/In Progress')),
  rejection_reason TEXT,
  assigned_worker_id UUID REFERENCES public.profiles(id),
  deadline TIMESTAMP WITH TIME ZONE,
  after_photo_url TEXT,
  cleanup_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Pickup requests table
CREATE TABLE public.pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  waste_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  preferred_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Completed', 'Rejected')),
  assigned_worker_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Status history table
CREATE TABLE public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  changed_by UUID REFERENCES public.profiles(id),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Points ledger table
CREATE TABLE public.points_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_id UUID REFERENCES public.reports(id),
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Awareness articles table
CREATE TABLE public.awareness_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- Initial Settings
INSERT INTO public.settings (key, value) VALUES
  ('point_citizen_report_resolved', '20'),
  ('point_worker_cleanup_resolved', '30');

-- Trigger to award points automatically when a report becomes Resolved
CREATE OR REPLACE FUNCTION award_points_on_resolve()
RETURNS TRIGGER AS $$
DECLARE
  citizen_points INTEGER;
  worker_points INTEGER;
BEGIN
  IF NEW.status = 'Resolved' AND OLD.status != 'Resolved' THEN
    
    -- Get points from settings
    SELECT CAST(value AS INTEGER) INTO citizen_points FROM public.settings WHERE key = 'point_citizen_report_resolved';
    SELECT CAST(value AS INTEGER) INTO worker_points FROM public.settings WHERE key = 'point_worker_cleanup_resolved';
    
    IF citizen_points IS NULL THEN citizen_points := 20; END IF;
    IF worker_points IS NULL THEN worker_points := 30; END IF;

    -- Award citizen
    IF NEW.citizen_id IS NOT NULL THEN
      UPDATE public.profiles SET points = points + citizen_points WHERE id = NEW.citizen_id;
      INSERT INTO public.points_ledger (user_id, report_id, points, reason) 
      VALUES (NEW.citizen_id, NEW.id, citizen_points, 'Report Resolved');
    END IF;

    -- Award worker
    IF NEW.assigned_worker_id IS NOT NULL THEN
      UPDATE public.profiles SET points = points + worker_points WHERE id = NEW.assigned_worker_id;
      INSERT INTO public.points_ledger (user_id, report_id, points, reason) 
      VALUES (NEW.assigned_worker_id, NEW.id, worker_points, 'Cleanup Resolved');
    END IF;

    NEW.resolved_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER report_resolved_trigger
BEFORE UPDATE ON public.reports
FOR EACH ROW EXECUTE FUNCTION award_points_on_resolve();

-- RLS Policies (Enable RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awareness_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Admin check function
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Worker check function
CREATE OR REPLACE FUNCTION is_worker() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'Worker');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Citizens and workers can read own profile. Admins read all. Workers can read assigned citizens.
CREATE POLICY "Profiles viewable by related users" ON public.profiles FOR SELECT USING (
  auth.uid() = id OR is_admin() OR 
  (is_worker() AND EXISTS (SELECT 1 FROM public.reports WHERE assigned_worker_id = auth.uid() AND citizen_id = profiles.id)) OR
  (EXISTS (SELECT 1 FROM public.reports WHERE citizen_id = auth.uid() AND assigned_worker_id = profiles.id))
);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id AND role IN ('Citizen', 'Worker'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (role IN ('Citizen', 'Worker'));
CREATE POLICY "Admins update all profiles" ON public.profiles FOR UPDATE USING (is_admin());

-- Reports policies
CREATE POLICY "Citizens insert reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = citizen_id);
CREATE POLICY "Citizens view own reports" ON public.reports FOR SELECT USING (auth.uid() = citizen_id);
CREATE POLICY "Workers view assigned reports" ON public.reports FOR SELECT USING (auth.uid() = assigned_worker_id);
CREATE POLICY "Workers update assigned reports" ON public.reports FOR UPDATE USING (auth.uid() = assigned_worker_id) WITH CHECK (auth.uid() = assigned_worker_id);
CREATE POLICY "Admins full access reports" ON public.reports FOR ALL USING (is_admin());

-- Pickup requests
CREATE POLICY "Citizens insert pickups" ON public.pickup_requests FOR INSERT WITH CHECK (auth.uid() = citizen_id);
CREATE POLICY "Citizens view own pickups" ON public.pickup_requests FOR SELECT USING (auth.uid() = citizen_id);
CREATE POLICY "Workers view assigned pickups" ON public.pickup_requests FOR SELECT USING (auth.uid() = assigned_worker_id);
CREATE POLICY "Workers update assigned pickups" ON public.pickup_requests FOR UPDATE USING (auth.uid() = assigned_worker_id) WITH CHECK (auth.uid() = assigned_worker_id);
CREATE POLICY "Admins full access pickups" ON public.pickup_requests FOR ALL USING (is_admin());

-- Status history
CREATE POLICY "Users view related history" ON public.status_history FOR SELECT USING (
  is_admin() OR 
  EXISTS (SELECT 1 FROM public.reports r WHERE r.id = report_id AND (r.citizen_id = auth.uid() OR r.assigned_worker_id = auth.uid()))
);
CREATE POLICY "Users insert related history" ON public.status_history FOR INSERT WITH CHECK (
  is_admin() OR 
  EXISTS (SELECT 1 FROM public.reports r WHERE r.id = report_id AND (r.citizen_id = auth.uid() OR r.assigned_worker_id = auth.uid()))
);

-- Points ledger
CREATE POLICY "Users view own points" ON public.points_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all points" ON public.points_ledger FOR SELECT USING (is_admin());

-- Awareness
CREATE POLICY "Public can view articles" ON public.awareness_articles FOR SELECT USING (true);
CREATE POLICY "Admins can edit articles" ON public.awareness_articles FOR ALL USING (is_admin());

-- Settings
CREATE POLICY "Admins full access settings" ON public.settings FOR ALL USING (is_admin());

-- Storage Buckets Setup (Private)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reports-before', 'reports-before', false), ('reports-after', 'reports-after', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage Policies for reports-before
CREATE POLICY "Insert reports-before" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'reports-before' AND auth.role() = 'authenticated' AND name LIKE auth.uid()::text || '%');
CREATE POLICY "View reports-before" ON storage.objects FOR SELECT USING (bucket_id = 'reports-before' AND (is_admin() OR name LIKE auth.uid()::text || '%' OR EXISTS (SELECT 1 FROM public.reports WHERE before_photo_url LIKE '%' || name AND assigned_worker_id = auth.uid())));

-- Storage Policies for reports-after
CREATE POLICY "Insert reports-after" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'reports-after' AND auth.role() = 'authenticated' AND name LIKE auth.uid()::text || '%');
CREATE POLICY "View reports-after" ON storage.objects FOR SELECT USING (bucket_id = 'reports-after' AND (is_admin() OR name LIKE auth.uid()::text || '%' OR EXISTS (SELECT 1 FROM public.reports WHERE after_photo_url LIKE '%' || name AND citizen_id = auth.uid())));
