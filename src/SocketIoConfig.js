import io from 'socket.io-client';
const urlLocal = 'http://localhost:3000';
const urlOnline = 'https://url3k.sse.codesandbox.io/';
const urlHeroku = 'https://backend-ddtank.herokuapp.com/';
function SocketIoConfig() {
    const socket = io(urlHeroku);
    return socket;
}

export default SocketIoConfig;