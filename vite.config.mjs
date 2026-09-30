import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        login: resolve(import.meta.dirname, 'login.html'),
        citizenIndex: resolve(import.meta.dirname, 'Citizen/index.html'),
        citizenComplaints: resolve(import.meta.dirname, 'Citizen/my-complaints.html'),
        citizenReport: resolve(import.meta.dirname, 'Citizen/report.html'),
        citizenPickup: resolve(import.meta.dirname, 'Citizen/pickup.html'),
        workerIndex: resolve(import.meta.dirname, 'Worker/index.html'),
        workerTask: resolve(import.meta.dirname, 'Worker/task.html'),
        adminIndex: resolve(import.meta.dirname, 'Admin/index.html'),
        adminVerifyReports: resolve(import.meta.dirname, 'Admin/verify-reports.html'),
        adminVerifyCleanup: resolve(import.meta.dirname, 'Admin/verify-cleanup.html'),
        adminAnalytics: resolve(import.meta.dirname, 'Admin/analytics.html'),
        awarenessIndex: resolve(import.meta.dirname, 'Awareness/index.html')
      }
    }
  }
});
