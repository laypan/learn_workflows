var $, fill;

$ = require('jquery');

(fill = function(item) {
  return $('.tagline').append("" + item);
})('這是全世界最厲害的~~~~~~~~~~~~');

fill;
