import fs from 'fs';
import https from 'https';

const hotels = [
  "Taj Mahal Palace Hotel",
  "ITC Grand Chola",
  "Rambagh Palace",
  "Lake Palace",
  "Leela Palace Bangalore",
  "Falaknuma Palace",
  "Grand Hyatt Kochi",
  "The Imperial, New Delhi",
  "Taj Surya Coimbatore",
  "Madurai hotel",
  "Kumarakom Lake Resort",
  "Coorg resort",
  "Oberoi Amarvilas",
  "ITC Windsor",
  "Trident Nariman Point",
  "Wildflower Hall Shimla",
  "Taj Exotica Goa",
  "Jawai Bandh",
  "Umaid Bhawan Palace",
  "Kovalam beach resort"
];

async function getWikiImage(query) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&format=json&pithumbsize=800`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
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
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  const urls = [];
  for (const h of hotels) {
    let img = await getWikiImage(h);
    if (!img) {
      // Fallback
      img = `https://picsum.photos/seed/${h.replace(/\s/g, '')}/800/500`;
    }
    urls.push(img);
  }
  console.log(JSON.stringify(urls, null, 2));
}

run();
