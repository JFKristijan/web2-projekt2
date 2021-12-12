const express = require('express');
const dotenv = require('dotenv').config();
const validator = require('validator')
const PORT = process.env.PORT || 8080
const app = express();
const session = require('express-session')
app.use(express.urlencoded())
const db = require('./db/index')

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(session({
  secret: 'play him off, keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: false
  }
}))

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
  let userSql;
  let params;
  if (securityLevel == 0) {
    userSql = `select username,email from users where lower(username) like '${req.body.username}';`
    params = []
  } else {
    userSql = `select username,email from users where lower(username) = ?;`
    params = [req.body.username.toLowerCase()]

  }

  db.all(userSql, params, (err, result) => {
    if (err) {
      console.log('Error' + err.message);
    }
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

app.post('/xss', function (req, res) {
  let name = req.body.name
  if (securityLevel == 1) {
    name = validator.escape(name)
  }
  res.render('pages/xss', {
    securityLevel: securityLevel,
    active: 'xss',
    name: name
  });
})

app.get('/csrf', function (req, res) {
  let status;
  let user;
  if (req.session && req.session.user) {
    user = req.session.user
  }
  db.all('select username, status from statuses', [], (err, result) => {
    if (err) {
      console.log('Error' + err.message);
    }
    if (result) {
      result.forEach((row) => {
        console.log(row)
      })
      status = result
    } else {
      status = []
    }

    res.render('pages/csrf', {
      securityLevel: securityLevel,
      active: 'csrf',
      status: status,
      user: user
    });
  });

});

app.post('/csrf', function (req, res) {
  let user;
  if (req.body.username) {
    req.session.user = req.body.username;
    user = req.body.username;
  }
  db.all('select username, status from statuses', [], (err, result) => {
    if (err) {
      console.log('Error' + err.message);
    }
    if (result) {
      result.forEach((row) => {
        console.log(row)
      })
      status = result
    } else {
      status = []
    }

    res.render('pages/csrf', {
      securityLevel: securityLevel,
      active: 'csrf',
      status: status,
      user: user
    });
  });
});

app.get('/status', function (req, res) {
  if (securityLevel == 1) {
    res.redirect('/csrf');
  } else {
    let user;
    if (req.session.user) {
      db.run('insert into statuses(username,status) values (?,?)',
        [req.session.user, req.query.status],
        (err, result) => {
          if (err) {
            console.log('Error' + err.message);
          }
          res.redirect('/csrf')
        });

    } else {
      res.status(404).end()
    }
  }
});

app.post('/status', function (req, res) {
  if (securityLevel == 0) {
    res.redirect('/csrf');
  }
  let user;
  if (req.session.user) {
    db.run('insert into statuses(username,status) values (?,?)',
      [req.session.user, req.query.status],
      (err, result) => {
        if (err) {
          console.log('Error' + err.message);
        }
        res.redirect('/csrf')
      });
  } else {
    res.status(404).end()
  }
});

app.post('/logout', function (req, res) {
  req.session.destroy();
  res.status(200).end();
});

app.post('/seclevel', function (req, res) {
  securityLevel = securityLevel == 0 ? 1 : 0;
  res.json({
    securityLevel: securityLevel
  });
});

app.get("/pictures", (req, res) => {
  res.render('pages/pictures', {
    securityLevel: securityLevel,
    active: 'pics'
  })
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))