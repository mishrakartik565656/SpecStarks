import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        citizenIndex: resolve(__dirname, 'Citizen/index.html'),
        citizenComplaints: resolve(__dirname, 'Citizen/my-complaints.html'),
        citizenReport: resolve(__dirname, 'Citizen/report.html'),
        workerIndex: resolve(__dirname, 'Worker/index.html'),
        workerTask: resolve(__dirname, 'Worker/task.html'),
        adminIndex: resolve(__dirname, 'Admin/index.html'),
        adminVerifyReports: resolve(__dirname, 'Admin/verify-reports.html'),
        adminVerifyCleanup: resolve(__dirname, 'Admin/verify-cleanup.html'),
        adminAnalytics: resolve(__dirname, 'Admin/analytics.html'),
        awarenessIndex: resolve(__dirname, 'Awareness/index.html')
      }
    }
  }
});
