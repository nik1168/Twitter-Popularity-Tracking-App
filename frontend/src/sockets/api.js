import io from 'socket.io-client';
import {URL_SERVER} from "../Api";

const  socket = io(URL_SERVER);

function subscribeToTweets(observer) {
    console.log("Subscribe to tweets");
    socket.connect();
    socket.on('tweet', data => observer.next(data));
    socket.on('connect_error', error => console.log("Connection error"));
}
function disconnectSocket() {
    socket.disconnect();
}
export { subscribeToTweets, disconnectSocket};
