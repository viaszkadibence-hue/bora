const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
http.createServer((request, response) => {
  const name = request.url === '/' ? 'index.html' : request.url.slice(1);
  const file = path.join(root, name);
  fs.readFile(file, (error, data) => {
    response.writeHead(error ? 404 : 200, { 'Content-Type': types[path.extname(file)] || 'text/plain' });
    response.end(error ? 'Not found' : data);
  });
}).listen(4173);
