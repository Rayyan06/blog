const io = require('socket.io')(3000, {

});


io.on('connection', client => {
    client.emit('init', {data: 'Hallo World'});
});

