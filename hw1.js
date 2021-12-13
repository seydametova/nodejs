const colors = require('colors');

let colorNumber = 1;

const [, , from, to] = process.argv;
if (isNaN(from) || isNaN(to)) {
    console.log(colors.red("введите два числа"))
    return;
}

let hasPrime = false;
for (let i = from; i <= to; i++) {
    if (isPrime(i)) {
        hasPrime = true;
        console.log(nextColor()(i));
    }    
}

if (!hasPrime) {
    console.log(colors.red("нет простых чисел"))
}

function isPrime(number) {
    if (number <= 1) {
        return false;
    }
    if (number === 2) {
        return true;
    }
    if (number % 2 === 0) {
        return false;
    }

    var boundary = Math.floor(Math.sqrt(number));

    for (let i = 3; i <= boundary; i += 2) {
        if (number % i == 0) {
            return false;
        } 
    }

    return true;
}


function nextColor() {
    if (colorNumber > 3) {
        colorNumber = 1;
    }
    if (colorNumber % 3 === 0) {
        colorNumber++;
        return colors.red;
    }
    if (colorNumber % 2 === 0) {
        colorNumber++;
        return colors.yellow;
    }

    colorNumber++;
    return colors.green;
}