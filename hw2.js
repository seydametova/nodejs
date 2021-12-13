'use strict'
// node hw2.js 00-14-12-2021 01-14-12-2021

const EventEmitter = require('events');
const emitter = new EventEmitter();

const run = () => {
    const timers = process.argv.slice(2);

    timers.forEach((time, index) => {
        const [hours, day, month, year] = time.split("-");
        const date = new Date(year, month - 1, day, hours);
        if (date.toString() === "Invalid Date") {
            emitter.emit("invalid-date", index + 1);
        } else {
           emitter.emit("set-timer", date, index + 1);
        }
    })
};




class Handler {
    static setTimer(date, timerNumber) {
        const interval = setInterval(() => {
            const milliseconds = date.getTime();
            const now = Date.now();
            if (milliseconds <= now) {
                emitter.emit("timer-stop", timerNumber);
                clearInterval(interval);
            } else {
                emitter.emit("seconds-left", timerNumber, Math.round((milliseconds - now) / 1000));
            }
        }, 1000);
    }

    static secondsLeft(timerNumber, seconds) {
        console.log(`Таймер ${timerNumber}: осталось ${seconds} секунд`);
    }

    static timerStop(timerNumber) {
        console.log(`Таймер ${timerNumber} завершен`)
    }

    static invalidDate(timerNumber) {
        console.error(`Таймер ${timerNumber}: неверный формат ввода, введите дату чч-дд-мм-гггг`);
    }
};

emitter.on("set-timer", Handler.setTimer);
emitter.on("seconds-left", Handler.secondsLeft);
emitter.on("timer-stop", Handler.timerStop);
emitter.on("invalid-date", Handler.invalidDate);

run();