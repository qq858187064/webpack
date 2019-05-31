//main.js 
const a = require('./js/a.js');
const b = require('./js/b.js');
require('./css/a.css');
require('./css/b.css');
var root=document.getElementById("root")
root.appendChild(a());
root.appendChild(b());