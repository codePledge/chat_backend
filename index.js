const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");
var express = require("express");
var app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

//---------------------------SOCKET.IO-----------------------------------------------//
var users = {};
io.on("connect", (socket) => {
  socket.on("join", (data) => {
    users[data] = socket;
    io.emit("user_connected", data.username);

    //   socket.join(user.room);

    //   socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    //   socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    //   io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    //   callback();
  });

  socket.on("sendMessage", (message) => {
    io.emit("messages", { user: message.username, text: message.message });

    //   callback();
  });

  socket.on("disconnect", () => {
    //   const user = removeUser(socket.id);
    //   if(user) {
    //     io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
    //     io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    //   }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build")); // serve the static react app
  app.get(/^\/(?!api).*/, (req, res) => {
    // don't serve api routes to react app
    res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
  });
  console.log("Serving React App...");
}

server.listen(process.env.PORT || 5000);
// app.listen(5000);
