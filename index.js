// heroku update

const express = require('express');
const path = require('path');
const PORT = 80;

const Filter = require('bad-words');
filter = new Filter();

// App setup
const app = express();
const socketIO = require('socket.io');

const server = express()
  .use(app)
  .listen(PORT, () => console.log(`Listening Socket on ${ PORT }`));

const io = socketIO(server);

var array = []

app.use('/views', express.static('views'));
app.use('/socket.io', express.static('socket.io'));



function messageHandler(req){
  let message = req.query.message;
  let name = req.query.name;

  if(!message){
    return false;
  }

  message = name+": "+message
  message = filter.clean(message);

  array.push(message);

  io.emit('message', message);

  console.log(array);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
})

app.get('/messages', (req, res) => {
  res.send(array);
})

app.get('/submit', (req, res) => {
  messageHandler(req);
  res.redirect('/?'+req.query.name);
})

app.get('/name', (req, res) => {
  res.redirect('/?'+req.query.name)
})