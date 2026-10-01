import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        citizenIndex: resolve(__dirname, 'Citizen/index.html'),
        citizenComplaints: resolve(__dirname, 'Citizen/my-complaints.html'),
        citizenReport: resolve(__dirname, 'Citizen/report.html'),
        citizenPickup: resolve(__dirname, 'Citizen/pickup.html'),
        citizenRewards: resolve(__dirname, 'Citizen/rewards.html'),
        workerIndex: resolve(__dirname, 'Worker/index.html'),
        workerTask: resolve(__dirname, 'Worker/task.html'),
        adminIndex: resolve(__dirname, 'Admin/index.html'),
        adminDashboard: resolve(__dirname, 'Admin/dashboard.html'),
        adminVerifyReports: resolve(__dirname, 'Admin/verify-reports.html'),
        adminVerifyCleanup: resolve(__dirname, 'Admin/verify-cleanup.html'),
        adminAnalytics: resolve(__dirname, 'Admin/analytics.html'),
        adminManagePickups: resolve(__dirname, 'Admin/manage-pickups.html'),
        awarenessIndex: resolve(__dirname, 'Awareness/index.html')
      }
    }
  }
});
