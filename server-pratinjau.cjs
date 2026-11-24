// Server statis tanpa dependensi untuk pratinjau portofolio.
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'site');
const PORT = 8080;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';

    const full = path.join(ROOT, path.normalize(urlPath));
    if (!full.startsWith(ROOT)) {
      res.writeHead(403).end('403');
      return;
    }

    fs.readFile(full, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404</h1><p>Berkas tidak ditemukan: ' + urlPath + '</p>');
        return;
      }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(full)] || 'application/octet-stream' });
      res.end(data);
      console.log('200 ' + urlPath);
    });
  })
  .listen(PORT, () => console.log('Pratinjau berjalan di http://localhost:' + PORT));
