const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'Admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(adminDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match the nav-links block and replace it cleanly
  const navRegex = /<div class="nav-links">[\s\S]*?<\/div>/;
  
  let newNav = `
      <div class="nav-links">
        <a href="verify-reports.html">Verify Reports</a>
        <a href="verify-cleanup.html">Verify Cleanups</a>
        <a href="manage-pickups.html">Manage Pickups</a>
        <a href="analytics.html">Analytics</a>
        <a href="#" class="logout-btn btn btn-outline" style="padding: 0.5rem 1rem;">Logout</a>
      </div>
  `;

  // Highlight the active link based on the filename
  if (file === 'verify-reports.html') {
    newNav = newNav.replace('<a href="verify-reports.html">', '<a href="verify-reports.html" style="color: var(--primary); font-weight: 600;">');
  } else if (file === 'verify-cleanup.html') {
    newNav = newNav.replace('<a href="verify-cleanup.html">', '<a href="verify-cleanup.html" style="color: var(--primary); font-weight: 600;">');
  } else if (file === 'manage-pickups.html') {
    newNav = newNav.replace('<a href="manage-pickups.html">', '<a href="manage-pickups.html" style="color: var(--primary); font-weight: 600;">');
  } else if (file === 'analytics.html') {
    newNav = newNav.replace('<a href="analytics.html">', '<a href="analytics.html" style="color: var(--primary); font-weight: 600;">');
  }

  content = content.replace(navRegex, newNav.trim());
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Admin navs fixed');
