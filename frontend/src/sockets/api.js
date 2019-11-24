import io from 'socket.io-client';

const  socket = io('http://localhost:3001');
function subscribeToTweets(observer) {
    console.log("Subscribe to tweets");
    socket.on('tweet', data => observer.next(data));
}
function disconnectSocket() {
    socket.disconnect();
}
export { subscribeToTweets, disconnectSocket};
