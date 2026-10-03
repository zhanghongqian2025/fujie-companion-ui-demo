const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
http.createServer((req,res)=>{
  const route = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const name = route === '/' ? 'index.html' : route === '/pulse/' ? 'pulse/index.html' : route.slice(1);
  if(!['index.html','style.css','app.js','pulse/index.html','pulse/style.css','pulse/app.js','pulse/completion.json','pulse/vendor/lottie-light-5.13.0.min.js'].includes(name)){res.writeHead(404);res.end('Not found');return;}
  fs.readFile(path.join(__dirname,name),(err,data)=>{if(err){res.writeHead(500);res.end('Unavailable');return;}res.writeHead(200,{'Content-Type':types[path.extname(name)],'Cache-Control':'no-store'});res.end(data);});
}).listen(8742,'127.0.0.1',()=>console.log('Lune preview: http://127.0.0.1:8742'));
