const fs = require('fs');
let c = fs.readFileSync('Admin/dashboard.html', 'utf8');
// Fix the malformed HTML
c = c.replace(/\s*<h3>Manage Pickups<\/h3>\s*<p>Review citizen pickup requests and assign workers\.<\/p>\s*<\/div>/, '');

// Now insert the correct card before the analytics card
const cardHTML = `
      <div class="card text-center" style="cursor: pointer;" onclick="window.location.href='manage-pickups.html'">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🚛</div>
        <h3>Manage Pickups</h3>
        <p>Review citizen pickup requests and assign workers.</p>
      </div>`;

c = c.replace(/<div class="card text-center" style="cursor: pointer;" onclick="window\.location\.href='analytics\.html'">/, cardHTML + '\n      <div class="card text-center" style="cursor: pointer;" onclick="window.location.href=\'analytics.html\'">');
fs.writeFileSync('Admin/dashboard.html', c);
console.log('Dashboard fixed!');
