'use strict';

// node hw5.js

// Подключение библиотеки
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const cluster = require('cluster');
const os = require('os');
const replaceStream = require('replacestream');
const { deepStrictEqual } = require('assert');

// Проверка отработки процесса master
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running...`);

    for (let i = 0; i < os.cpus().length; i++) {
        console.log(`Forking process number ${i}`);
        cluster.fork(); // Создаем инстанс
    }
} else { // Запускаем каждый инстанс
    console.log(`Worker ${process.pid} is running...`);
    const filePath = path.join(__dirname, 'hw5.html');

    const server = http.createServer(((req, res) => {
        console.log(`Worker ${process.pid} handling request`);

        const readStream = fs.createReadStream(filePath);
        const fullPath = path.join(__dirname, req.url);

        if (fs.existsSync(fullPath)) {
            if (fs.lstatSync(fullPath).isDirectory()) {
                res.writeHead(200, 'OK', {
                    'Content-Type': 'text/html',
                });
                
                const list = `<ul>
                    ${req.url === "/" ? "" : "<li><a href=\"/..\">..</a></li>"}
                    ${fs.readdirSync(fullPath).map(item => `<li><a href="${req.url === "/" ? "" : req.url}/${item}">${item}</a></li>`).join("")}
                </ul>`

                readStream
                    .pipe(replaceStream("{list}", list))
                    .pipe(res);
            } else {
                const fileStream = fs.createReadStream(fullPath);
                fileStream.pipe(res);
            }
        } else {
            res.writeHead(404), "Not found";
            res.write("Not found");
            res.end();
        }          
    }));
    server.listen(5555);
};