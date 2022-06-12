require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const errorMiddleware = require('./middleware/error-middleware');

const app = express();

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/article', require('./routes/article.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/reaction', require('./routes/reaction.routes'));
app.use('/api/comment', require('./routes/comment.routes'));

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}`);
    });
  } catch (e) {
    console.log('Server error', e.message);
    process.exit(1);
  }
}

start();
