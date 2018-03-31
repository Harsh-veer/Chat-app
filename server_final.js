var express = require('express');
var app = express();

var http = require('http');
var myserver = http.Server(app);

var io = require('socket.io')(myserver);

app.use(express.static('avatar'));// here express is that express = require('express')
app.use(express.static('public_files'));// here express is that express = require('express')

var username = '';
var check_id=[];
var check_user=[];
app.get('/', function(req, res){
    res.sendFile(__dirname + '/avatar.html');
});

io.on('connection',function(socket){
    console.log('User connected: '+ socket.id);
    
    socket.on('sbmtd',function(name){
        console.log(name + ' has entered chatroom');
        username = name;
    });
    socket.on('msgrec',function(msg,check){
        var id = String(socket.id);
        var c=0;
        var l = check_id.length;
        for(var i=0;i<l;i++){
            if(check_id[i] == id){
                username = check_user[i];c=1;
            }
        }
            
            if(c==0){
                check_id.push(id);
                check_user.push(username);
            }
        console.log('message: '+ msg + ' with this id: ' + id + '  ' + c);
        io.emit('msgrec', msg, username,check);
    });
});


myserver.listen(8000, function(){
    console.log('Listening: ');
});