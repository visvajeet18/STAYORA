const fs = require('fs');

let content = fs.readFileSync('src/store/hotelsSlice.js', 'utf8');

const seeds = [
  'tajmahalpalace', 'itcgrandchola', 'rambaghpalace', 'tajlakepalace', 'theleelapalace',
  'tajfalaknuma', 'grandhyattkochi', 'theimperialdelhi', 'vivantacoimbatore', 'heritagemadurai',
  'kumarakomlake', 'evolvebackcoorg', 'oberoiamarvilas', 'itcwindsor', 'tridentnariman',
  'wildflowerhall', 'tajexoticagoa', 'sujanjawai', 'umaidbhawan', 'leelakovalam'
];

let i = 0;
content = content.replace(/imageUrl:\s*'.*?'/g, () => {
  const seed = seeds[i] || `hotel${i}`;
  i++;
  return `imageUrl: 'https://picsum.photos/seed/${seed}/800/600'`;
});

fs.writeFileSync('src/store/hotelsSlice.js', content, 'utf8');
console.log('Done replacing images in hotelsSlice.js');
