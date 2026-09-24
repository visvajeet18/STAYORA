const https = require('https');
const hotels = [
  'Taj Mahal Palace Hotel', 
  'Umaid Bhawan Palace', 
  'Rambagh Palace', 
  'Lake Palace', 
  'Falaknuma Palace', 
  'Mysore Palace', 
  'Hawa Mahal', 
  'Red Fort', 
  'India Gate', 
  'Victoria Memorial', 
  'Charminar', 
  'Qutb Minar', 
  'Gateway of India', 
  'Amer Fort', 
  'Mehrangarh', 
  'City Palace, Udaipur', 
  'Jal Mahal', 
  'Lotus Temple', 
  'Golden Temple', 
  'Khajuraho Group of Monuments'
];

const fetchWiki = (title) => {
  return new Promise((resolve) => {
    https.get(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=800`, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const pages = parsed.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== '-1' && pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(null);
          }
        } catch(e) { resolve(null); }
      });
    });
  });
};

Promise.all(hotels.map(h => fetchWiki(h))).then(urls => {
  console.log(JSON.stringify(urls, null, 2));
});
