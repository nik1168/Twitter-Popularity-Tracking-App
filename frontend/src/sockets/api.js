import io from 'socket.io-client';

const  socket = io('http://localhost:3001');
function subscribeToTweets(cb) {
    console.log("Subscribe to tweets")
    socket.on('tweet', data => cb(null, data));
}
export { subscribeToTweets };
