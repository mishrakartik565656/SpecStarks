const fs = require('fs');
let c = fs.readFileSync('Admin/dashboard.html', 'utf8');
c = c.replace(/<div class="card text-center" style="cursor: pointer;" onclick="window\.location\.href='manage-pickups\.html'">[\s\S]*?<\/div>/, '');
fs.writeFileSync('Admin/dashboard.html', c);
console.log('Done');
