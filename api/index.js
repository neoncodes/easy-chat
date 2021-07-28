const express = require('express');
const path = require('path');
const app = express();
const port = 80;
const ejs = require('ejs');

var array = []

app.use('/views', express.static('views'));
app.set('view engine', 'ejs')

function messageHandler(req, ip){
  let message = req.query.message;

  if(!message){
    return false;
  }

  array.push(ip+": "+message);
}

app.get('/', (req, res) => {
  console.log(req.query)
  res.render('index', {
    listItems: array
  })
})

app.get('/submit', (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress 
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }

  messageHandler(req, ip);
  res.redirect('/');
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
})