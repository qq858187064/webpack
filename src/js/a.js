// a.js
module.exports = function() {
  var a = document.createElement('div');alert(1);
  a.innerHTML = "a"+Math.random();
  return a;
};