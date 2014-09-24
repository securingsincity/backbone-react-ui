var ReactTools = require('react-tools');
var MAGIC = "/** @jsx";
module.exports = {
  process: function(src, file) {
    if (!/\.jsx$/.test(file) || src.slice(0, MAGIC.length) != MAGIC) return src;
    return ReactTools.transform(src);
  }
};
