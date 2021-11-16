const express = require('express');
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 8080
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs')

var securityLevel = 0;

app.get('/', function (req, res) {
  res.render('pages/index',{
    securityLevel:securityLevel
  });
});

app.get('/sql', function (req, res) {
  res.render('pages/sql',{
    securityLevel:securityLevel,
    active:'sql'
  });
});

app.get('/xss', function (req, res) {
  res.render('pages/xss',{
    securityLevel:securityLevel,
    active:'xss'
  });
});

app.get('/csrf', function (req, res) {
  res.render('pages/csrf',{
    securityLevel:securityLevel,
    active:'csrf'
  });
});

app.post('/seclevel',function (req, res) {
  securityLevel=securityLevel==0?1:0;
  res.json({securityLevel:securityLevel});
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))