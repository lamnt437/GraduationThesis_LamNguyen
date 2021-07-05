var createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const meetingRouter = require('./routes/meeting');
const postRouter = require('./routes/posts');
const authRouter = require('./routes/auth');
const classRouter = require('./routes/classroom');
const profileRouter = require('./routes/profile');
const sandboxRouter = require('./routes/sandbox');
const notificationRouter = require('./routes/notification');
const topicRouter = require('./routes/topic');

const app = express();
app.set('view engine', 'pug');
require('./startup/prod')(app);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.use('/api/users', usersRouter);
app.use('/api/meeting', meetingRouter);
app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);
app.use('/api/classroom', classRouter);
app.use('/api/profile', profileRouter);
app.use('/api/sandbox', sandboxRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/topic', topicRouter);

// serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
