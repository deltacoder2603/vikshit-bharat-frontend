// Simple search for department-head-dashboard
const fs = require('fs');
const content = fs.readFileSync('/App.tsx', 'utf8');
const lines = content.split('\n');

// Find lines containing 'department-head-dashboard'
lines.forEach((line, index) => {
  if (line.includes('department-head-dashboard')) {
    console.log(`Line ${index + 1}: ${line}`);
    // Show context (5 lines before and after)
    for (let i = Math.max(0, index - 5); i <= Math.min(lines.length - 1, index + 5); i++) {
      if (i === index) {
        console.log(`>>> ${i + 1}: ${lines[i]}`);
      } else {
        console.log(`    ${i + 1}: ${lines[i]}`);
      }
    }
    console.log('---');
  }
});