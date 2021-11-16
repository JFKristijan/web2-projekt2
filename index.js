const e = require('express');
const express = require('express');
const dotenv = require('dotenv').config();

const PORT = process.env.PORT || 8080
const app = express();
app.use(express.urlencoded())
const db = require('./db/index')
app.use(express.static('public'));
app.set('view engine', 'ejs')

var securityLevel = 0;

app.get('/', function (req, res) {
  res.render('pages/index', {
    securityLevel: securityLevel
  });
});

app.get('/sql', function (req, res) {
  res.render('pages/sql', {
    securityLevel: securityLevel,
    active: 'sql'
  });
});

app.post('/sql', function (req, res) {

  console.log(req.body);
  let userSql;
  let params;
  if (securityLevel == 0) {
    userSql = "select id,password from users where lower(username) like '" + req.body.username + "';"
    params=[]
  }else{
    userSql = "select id,password from users where lower(username) like '?';"
    params=[req.body.username]
  }

    db.all(userSql, params, (err, result) => {
      if (err) {
        console.log('Error' + err.message);
      }
      console.log('Done')
      if (result) {
        result.forEach((row) => {
          console.log(row)
        })
        users = result
      } else {
        users = []
      }
      res.render('pages/sql', {
        securityLevel: securityLevel,
        active: 'sql',
        users: users
      });
    });

});

app.get('/xss', function (req, res) {
  res.render('pages/xss', {
    securityLevel: securityLevel,
    active: 'xss'
  });
});

app.get('/csrf', function (req, res) {
  res.render('pages/csrf', {
    securityLevel: securityLevel,
    active: 'csrf'
  });
});

app.post('/seclevel', function (req, res) {
  securityLevel = securityLevel == 0 ? 1 : 0;
  res.json({
    securityLevel: securityLevel
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))