//main.js 
import router from './js/router.js'
const a = require('./js/a.js');
const b = require('./js/b.js');
require('./css/a.css');
require('./css/b.css');
require('./css/c.css');
var root=document.getElementById("root")
root.appendChild(a());
root.appendChild(b());
alert(123)
import app from './page/app.vue'
var vm = new Vue({
    el: '#app',
    router,
    render:  c => c(app)
})