'use strict';

// node hw4.js

const fs = require('fs');
const readline = require('readline');
const inquirer = require('inquirer');
const path = require('path');
const yargs = require('yargs');
//
const worker_threads = require('worker_threads');


const ips = [
    '89.123.1.41',
    '34.48.240.111'
];

const executionDir = process.cwd();
const isFile = (path) => fs.lstatSync(path).isFile();
const list = (dirPath) => fs.readdirSync(path.join(executionDir, dirPath));



const options = yargs
    .usage('Usage: -s <substrings>')
    .options('s', {
        alias: 'substrings',
        describe: 'Array of substrings',
        type: 'array',
        demandOption: true,
    }).argv;

inquirer
    .prompt([{
        name: 'fileName',
        type: 'list',
        message: 'Выберите файл: ',
        choices: list(""),
    }
]).then(async ({fileName}) => {
    await checkItem(fileName, "");    
});



async function processLineByLine(fileName, subStrings) {

  return new Promise((resolve, reject) => {
      // Создаем воркер, на вход передаем путь до файла и объект конфигурационный
      const worker = new worker_threads.Worker('./hw4.worker.js', {
          workerData: {fileName, subStrings}
      });

      // Подключаемся на событие
      worker.on('message', resolve); // Когда все хорошо - вызывается ф-ция resolve
      worker.on('error', reject); // Когда выходит ошибка - вызывается ф-ция reject
  });

  // subStrings.forEach(ip => {
  //   const fileName = `${ip}_requests.log`
  //   if (fs.existsSync(fileName)) {
  //     fs.unlinkSync(fileName);
  //   }
  // })

  // const fileStream = fs.createReadStream(fileName);

  // const rl = readline.createInterface({
  //   input: fileStream,
  //   crlfDelay: Infinity
  // });

  // const streams = {};

  // for await (const line of rl) {
  //   subStrings.forEach(ip => {
  //     if (line.includes(ip)) {

  //       let stream;
  //       if (ip in streams) {
  //         stream = streams[ip];
  //       } else {
  //         stream = fs.createWriteStream(`${ip}_requests.log`, {
  //           flags: 'a'
  //         });
  //         streams[ip] = stream;
  //       }

  //       stream.write(`${line}\n`);
  //     }
  //   });
  // }

  // Object.values(streams).forEach(stream => stream.end());
}



async function chooseFolder(folderName, parentPath) {
    inquirer
        .prompt([{
            name: 'fileName',
            type: 'list',
            message: 'Выберите файл: ',
            choices: list(path.join(parentPath, folderName)),
        }
    ]).then(async ({ fileName }) => {
        await checkItem(fileName, path.join(parentPath, folderName));    
    })
}

async function checkItem(itemName, parentPath) {
    if (isFile(path.join(parentPath, itemName))) {
        await processLineByLine(path.join(parentPath, itemName), options.substrings);
    } else {
        await chooseFolder(itemName, parentPath);
    }
}