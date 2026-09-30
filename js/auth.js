import { supabaseClient } from './supabaseClient.js';

// Function to handle sign up
async function handleSignUp(e) {
  e.preventDefault();
  const btn = document.getElementById('signup-btn');
  btn.textContent = 'Signing up...';
  btn.disabled = true;

  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const phone = document.getElementById('signup-phone').value;
  const password = document.getElementById('signup-password').value;
  const role = document.getElementById('signup-role').value;
  const area = document.getElementById('signup-area').value;

  try {
    // 1. Sign up user
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // 2. Create profile
      const { error: profileError } = await supabaseClient
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            full_name: name,
            phone: phone,
            role: role,
            area: area
          }
        ]);

      if (profileError) throw profileError;

      showToast('Registration successful! Redirecting...', 'success');
      
      // Redirect based on role
      setTimeout(() => {
        if (role === 'Citizen') window.location.href = '/Citizen/index.html';
        else if (role === 'Worker') window.location.href = '/Worker/index.html';
      }, 1500);
    }
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    btn.textContent = 'Sign Up';
    btn.disabled = false;
  }
}

// Function to handle login
async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('login-btn');
  btn.textContent = 'Logging in...';
  btn.disabled = true;

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Fetch profile to know the role
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      showToast('Login successful! Redirecting...', 'success');
      
      setTimeout(() => {
        if (profile.role === 'Citizen') window.location.href = '/Citizen/index.html';
        else if (profile.role === 'Worker') window.location.href = '/Worker/index.html';
        else if (profile.role === 'Admin') window.location.href = '/Admin/index.html';
      }, 1000);
    }
  } catch (error) {
    showToast(error.message || 'Login failed', 'error');
  } finally {
    btn.textContent = 'Login';
    btn.disabled = false;
  }
}

// Function to handle logout
export async function handleLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = '/login.html';
}

// Ensure session and role checking for protected routes
export async function checkSession(allowedRoles = []) {
  const { data: { session } } = await supabaseClient.auth.getSession();
  
  if (!session) {
    window.location.href = '/login.html';
    return null;
  }

  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('role, full_name, points')
    .eq('id', session.user.id)
    .single();

  if (!profile) {
    // Session exists but no profile (maybe deleted), sign out
    await supabaseClient.auth.signOut();
    window.location.href = '/login.html';
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(profile.role)) {
    // Unauthorized role
    showToast('Unauthorized access. Redirecting...', 'error');
    setTimeout(() => {
      window.location.href = `/${profile.role}/index.html`;
    }, 1500);
    return null;
  }

  // Bind logout buttons if any exist
  const logoutBtns = document.querySelectorAll('.logout-btn');
  logoutBtns.forEach(btn => btn.addEventListener('click', handleLogout));

  return { session, profile };
}

// Bind event listeners if on login page
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) loginForm.addEventListener('submit', handleLogin);
  if (signupForm) signupForm.addEventListener('submit', handleSignUp);
});
