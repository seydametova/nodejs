// Подключаем библиотеку
const worker_threads = require('worker_threads');
const fs = require('fs');
const readline = require('readline');

const {fileName, subStrings} = worker_threads.workerData;

async function findInFile() {
    subStrings.forEach(ip => {
        const fileName = `${ip}_requests.log`
        if (fs.existsSync(fileName)) {
            fs.unlinkSync(fileName);
        }
    })

    const fileStream = fs.createReadStream(fileName);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const streams = {};

    for await (const line of rl) {
        subStrings.forEach(ip => {
            if (line.includes(ip)) {

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

findInFile().then(() => worker_threads.parentPort.postMessage(""));