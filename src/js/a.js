// a.js
module.exports = function() {
  var a = document.createElement('div');
  a.innerHTML = "a"+Math.random();
  return a;
};