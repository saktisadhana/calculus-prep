const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4178;
const ROOT = path.resolve(__dirname, '..');
const DEFAULT = 'index.html';

const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json' };

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath === '') urlPath = '/' + DEFAULT;
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log('Serving on http://localhost:' + PORT));
