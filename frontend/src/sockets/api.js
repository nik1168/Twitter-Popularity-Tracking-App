import io from 'socket.io-client';
import {URL_SERVER} from "../Api";

const  socket = io(URL_SERVER);

function subscribeToTweets(observer) {
    console.log("Subscribe to tweets");
    socket.on('tweet', data => observer.next(data));
}
function disconnectSocket() {
    socket.disconnect();
}
export { subscribeToTweets, disconnectSocket};
