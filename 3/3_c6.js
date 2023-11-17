const wsUri = "wss://echo-ws-service.herokuapp.com/";

const output = document.querySelector('.output');
const chatFrame = document.querySelector('.chat-frame');
const btnOpen = document.querySelector('.j-input-message');
const btnClose = document.querySelector('.j-btn-close');
const btnSend = document.querySelector('.j-btn-send');
const btnGeo = document.querySelector('.j-geolocation')

let websocket = null;
let flagIgnorAnswer = false

function writeToScreen(service_message) {
    // let pre = document.createElement("p");
    // pre.style.wordWrap = "break-word";
    // pre.innerHTML = service_message;
    // output.appendChild(pre);
    let pre = service_message;
    output.innerHTML = pre;

}
function writeToChat(message) {
    chatFrame.insertAdjacentHTML('beforeend', `${message}`)
}
// Вешаем на кнопку "Отправить" обработчик событий с запуском соединения если его еще нет и обработкой сообщений сервера
btnSend.addEventListener('click', () => {
    flagIgnorAnswer = false
    if (websocket === null) {
        websocket = new WebSocket(wsUri);
        websocket.onopen = function (evt) {
            writeToScreen("Echo-ws-service: CONNECTED");
            const message = document.querySelector('.j-input-message').value;
            writeToChat('<div class="user-message">' + message + '</div>');
            websocket.send(message);
        };
    } else {
        const message = document.querySelector('.j-input-message').value;
        writeToChat('<div class="user-message">' + message + '</div>');
        websocket.send(message);
    }
    websocket.onclose = function (evt) {
        writeToScreen("Echo-ws-service: DISCONNECTED");
    };
    websocket.onmessage = function (evt) {
        if (flagIgnorAnswer === false) {
            writeToScreen("Echo-ws-service: CONNECTED")
            writeToChat(
                '<div class="server-message">RESPONSE: ' + evt.data + '</div>'
            )
        } else {
            flagIgnorAnswer = false;
        };
    };
    websocket.onerror = function (evt) {
        writeToScreen(
            '<span style="color: red;">ERROR:</span> ' + evt.data
        );
    };
});
// Геолокатор
const error = () => {
    writeToScreen("Openstreetmap: Невозможно получить ваше местоположение");
}

const success = (position) => {
    console.log('position', position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    writeToChat(`<div class="user-message"><a href="https://www.openstreetmap.org/#map=18/${latitude}/${longitude}" target="_blank">Геолокация</a></div>`);
    websocket.send("Геолокация");
    writeToScreen("Openstreetmap: Местоположение определено")

}

btnGeo.addEventListener('click', () => {
    flagIgnorAnswer = true
    if (websocket === null) {
        websocket = new WebSocket(wsUri);
        websocket.onopen = function (evt) {
            writeToScreen("Echo-ws-service: CONNECTED");
        }
    }
    if (!navigator.geolocation) {
        writeToScreen("Ваш браузер: Geolocation не поддерживается вашим браузером");
    } else {
        writeToScreen("Openstreetmap: Определение местоположения…");
        navigator.geolocation.getCurrentPosition(success, error);
    }
});
// обработка закрытия соединения (в задании нет, но непонятно что делать с соединением дальше, на всякий случай сделал кнопку)
btnClose.addEventListener('click', () => {
    websocket.close();
    websocket = null;
});
