const crypto = require('crypto');
const hash = crypto.createHash('sha256');

var filename = '/Users/mxj/zoom/mxj-desktop-app/dev-release/darwin/mTool-alpha-5.8.15.zip'

const fs = require('fs');
const input = fs.createReadStream(filename);
input.on('readable', () => {
    // 哈希流只会生成一个元素。
    const data = input.read();
    if (data){
        console.log('update')
        hash.update(data);
    }

    else {
        console.log(`${hash.digest('hex')} ${filename}`);
    }
});
