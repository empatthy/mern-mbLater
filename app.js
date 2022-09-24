require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io');
const { createServer } = require('http');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('./middleware/error-middleware');
const path = require('path');

const PORT = process.env.PORT || 8000;

const app = express();
const httpServer = createServer();

let onlineUsers = [];

const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.id === userId) && onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const selectUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://infinite-oasis-67404.herokuapp.com/'
        : 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    console.log('A user has connected', onlineUsers);
  });

  socket.on('sendNotification', ({ receiverId }) => {
    const receiver = selectUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit('getNotification');
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    console.log('A user has disconnected', onlineUsers);
  });
});

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/article', require('./routes/article.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/reaction', require('./routes/reaction.routes'));
app.use('/api/comment', require('./routes/comment.routes'));
app.use('/api/notification', require('./routes/notification.routes'));
app.use('/api/uploads', require('./routes/file.routes'));
app.use('/static', express.static('static'));

app.use(errorMiddleware);

__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}`);
    });
    httpServer.listen(5000);
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1);
  }
}

start();
