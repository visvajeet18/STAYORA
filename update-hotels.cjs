const fs = require('fs');
let code = fs.readFileSync('src/store/hotelsSlice.js', 'utf8');
code = code.replace(/imageUrl:\s*'(.*?)',/g, "imageUrls: ['$1', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80'],");
fs.writeFileSync('src/store/hotelsSlice.js', code);
console.log('Updated hotelsSlice.js');
