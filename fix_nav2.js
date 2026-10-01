const fs = require('fs');
let c = fs.readFileSync('Admin/manage-pickups.html', 'utf8');
c = c.replace(/<a href="verify-cleanup\.html">Verify Cleanups<\/a><a href="manage-pickups\.html">Manage Pickups<\/a>/g, '<a href="verify-cleanup.html">Verify Cleanups</a>');
fs.writeFileSync('Admin/manage-pickups.html', c);
console.log('manage pickups fixed');
