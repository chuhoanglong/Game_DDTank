import io from 'socket.io-client';
const urlLocal = 'http://localhost:3000';
const urlOnline = 'https://url3k.sse.codesandbox.io/';

function SocketIoConfig() {
    const socket = io(urlOnline);
    return socket;
}

export default SocketIoConfig;