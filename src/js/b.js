// b.js
module.exports = function() {
  var b = document.createElement('div');
    b.innerHTML = "b"+Math.random();
    console.log("b.js")
  return b;
};