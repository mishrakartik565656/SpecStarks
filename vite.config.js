import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        citizenHome: resolve(__dirname, 'Citizen/index.html'),
        complaints: resolve(__dirname, 'Citizen/my-complaints.html'),
        pickup: resolve(__dirname, 'Citizen/pickup.html'),
        report: resolve(__dirname, 'Citizen/report.html'),
        adminHome: resolve(__dirname, 'Admin/index.html'),
        analytics: resolve(__dirname, 'Admin/analytics.html'),
        verifyCleanup: resolve(__dirname, 'Admin/verify-cleanup.html'),
        verifyReports: resolve(__dirname, 'Admin/verify-reports.html'),
      },
    },
  },
})