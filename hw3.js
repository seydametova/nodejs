'use strict';

// node hw3.js

const fs = require('fs');
const readline = require('readline');

const ips = [
    '89.123.1.41',
    '34.48.240.111'
];

async function processLineByLine() {
  ips.forEach(ip => {
    const fileName = `${ip}_requests.log`
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
    }
  })

  const fileStream = fs.createReadStream('access.log');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const streams = {};

  for await (const line of rl) {
    ips.forEach(ip => {
      if (line.startsWith(ip)) {

        let stream;
        if (ip in streams) {
          stream = streams[ip];
        } else {
          stream = fs.createWriteStream(`${ip}_requests.log`, {
            flags: 'a'
          });
          streams[ip] = stream;
        }

        stream.write(`${line}\n`);
      }
    });
  }

  Object.values(streams).forEach(stream => stream.end());
}

processLineByLine();
