const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'Admin');
const files = fs.readdirSync(adminDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(adminDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Match the specific line with manage-pickups
  const regex = /^\s*<a href="manage-pickups\.html".*?>Manage Pickups<\/a>\r?\n?/gm;
  content = content.replace(regex, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Removed manage pickups from all navs');
