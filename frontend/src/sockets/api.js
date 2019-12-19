import io from 'socket.io-client';
import {URL_SERVER} from "../Api";

const  socket = io(URL_SERVER);

function subscribeToTweets(observer) {
    console.log("Subscribe to tweets");
    socket.connect();
    socket.on('tweet', data => observer.next(data));
    socket.on('connect_error', error => console.log("Connection error"));
}
function disconnectSocket(cb = null) {
    socket.on('disconnect', function(){
        console.log("Socket disconnected");
        if(cb){
            setTimeout(()=>{
                console.log("There is a callback");
                cb()
            },100)

        }
    });
    socket.disconnect();
}
export { subscribeToTweets, disconnectSocket};
