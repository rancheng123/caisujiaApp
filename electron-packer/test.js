var yaml = require('js-yaml');
var fs   = require('fs');
var doc = yaml.safeLoad(fs.readFileSync('/Users/mxj/zoom/mxj-desktop-app/electron-packer/latest-mac.yml', 'utf8'));
console.log(doc);
