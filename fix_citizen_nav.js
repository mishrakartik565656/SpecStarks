const fs = require('fs');

const files = [
  'Citizen/index.html',
  'Citizen/my-complaints.html',
  'Citizen/pickup.html',
  'Citizen/report.html'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the exact line for pickup to safely append rewards
  // We look for Request Pickup</a> and insert Rewards link after it
  if (!content.includes('rewards.html')) {
    content = content.replace(/(<a href="pickup\.html".*?>Request Pickup<\/a>)/g, '$1\n        <a href="rewards.html">Rewards</a>');
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
});
