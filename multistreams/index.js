
// Подключаем библиотеку
const worker_threads = require('worker_threads');

// Функция генерации пароля, передаем данные(размер пароля)
const generatePassword = (size) => {
    // Возвращаем промис
    return new Promise((resolve, reject) => {
        // Создаем воркер, на вход передаем путь до файла и объект конфигурационный
        const worker = new worker_threads.Worker('./worker.js', {
            workerData: size,
        });

        // Подключаемся на событие
        worker.on('message', resolve); // Когда все хорошо - вызывается ф-ция resolve
        worker.on('error', reject); // Когда выходит ошибка - вызывается ф-ция reject
    });
};

(async () => {
    const passwordBytesSize = 4;
    const password = await generatePassword(passwordBytesSize);

    console.log(password);
})();
