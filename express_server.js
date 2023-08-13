const express = require('express');
// const cookieParser = require('cookie-parser'); //Parse Cookie header into readables, and populate req.cookies with an object keyed by the cookie names
const cookieSession = require("cookie-session");
// cookieSession is used to read encryped cookies => req.session.user_id
// const { redirect } = require('express/lib/response');
const app = express();
const PORT = 8080;
const bcrypt = require("bcryptjs");


app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
// middleware => in order to use request.body from a post method, to parse the data to be readable for humans. The body-parse library will convert the request body from a Buffer into string.

// app.use(cookieParser()); //in order to use req.cookie

app.use(cookieSession({
  // in order to use cookie_session the middleware to encryp cookies
  name: 'Bimas',
  // name is the cookies key to set, whose value will be encryped
  keys: ['one', 'two', 'three', 'four']
}));

let urlDatabase = {
  b6UTxQ: { longURL: 'https://www.tsn.ca', userID: 'aJ48lW' },
  i3BoGr: { longURL: 'https://www.google.ca', userID: 'aJ48lW' },
  IQ6965: { longURL: 'http://google.com', userID: '9hvRSr' },
  NJ9i5T: { longURL: 'http://google.com', userID: 'UjUlui' }
};

let users = {
  aJ48lW: { id: 'aJ48lW', email: 'user@example.com', password: '123' },
  user2RandomID: { id: 'user2RandomID', email: 'user2@example.com', password: '123' },
  '9hvRSr': {
    id: '9hvRSr',
    email: 'user3@example.com',
    hashedPassword: '$2a$10$Qkpt.I6j7YZNmsJgQQOWde/9rO8mGxFv7WnX6fFKfqTrbj4YmYGxu'
  },
  UjUlui: {
    id: 'UjUlui',
    email: 'user1@example.com',
    hashedPassword: '$2a$10$jes3t85CFT8kAHXLbEVSte03XigsW3bmUtin0k7Zyxw/8xrOO6agK'
  }
};
//create a database to store and access users data

const getUserByEmail = require('./helpers');

const urlsForUser = function(userId) {
  const urls = {};

  const ids = Object.keys(urlDatabase);
  for (const id of ids) {
    const url = urlDatabase[id];
    if (url.userID === userId) {
      urls[id] = url;
    }
  }
  return urls;
};

function generateRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomId = "";
  while (randomId.length < 6) {
    let index = Math.floor(Math.random() * characters.split('').length);
    randomId += characters.split('')[index];
  };
  return randomId;
}

app.get("/", (req, res) => {//get in order to see your response! get is to get whatever info on the webpage when you first landed on the page.
  const userId = req.session.user_id;
  const user = users[userId];
  if (user) {
    res.redirect('/urls');
  };
  if (!user) {
    res.redirect('/login');
  };
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>Word</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  // to read the value of encryped cookie
  // console.log('req.session:', req.cookies);
  console.log('req.session:', req.session);
  const user = users[userId];

  if (!user) {
    return res.send("Not logged in, Please<a href='/login'> log in</a>");
  };
  // console.log(urlDatabase);
  const templateVars = {
    urls: urlsForUser(userId),
    // return an array of id's!!!
    user: users[userId]
  }; //the variable needs to be inside an object so we can access values through keys
  res.render('urls_index', templateVars);
  return;//('the template to show HTML on the /urls web page', the variable whose value is an object to be referenced in the template)
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const user = users[userId];
  if (!user) {
    res.redirect("/login");
  }

  const templateVars = {
    user: users[req.session.user_id]
  };
  res.render("urls_new", templateVars);
  // the browser sends cookie data with subsequent get request
});

app.post("/urls", (req, res) => {
  const userID = req.session.user_id;
  const user = users[userID];
  if (!user) {
    res.send("<h1>Please log in to shorten URLs</h1>");
    return;
    // even though we redirect the GET /urls/new requests to GET /login, we still have to protect the POST /urls route too. Hiding the page to submit new urls isn't enough - a malicious user could use simple curl commands to interact with our server.
  }

  let id = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[id] = { longURL, userID }; //save the id = longURL pair in urldatabase. longURL is from urls_news.ejs, input/name
  // add userID to the urlDatabase
  console.log(urlDatabase[id]); // need to use the Express library's body parsing middleware to make the request.body hunmanreadable

  res.redirect(`/urls/${id}`); //when received a post request to /urls, it redirects to /urls/new id
});


app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  const id = req.params.id;
  const user = users[userId];
  if (!urlDatabase[id]) {
    res.send("Short URL does not exist");
    return;
    // check if the id exist in the database
  }

  if (!user) {
    res.send("<h1>Please log in to see your URLs.<h1>");
    return;
    //  check if the user is logged in
  };

  if (urlDatabase[id].userID !== userId) {
    res.send("You can't edit the URL because you don't own it.");
    return;
    // check if user owns the shortURl
  }

  const templateVars = {
    id: id,
    user: users[userId],
    longURL: urlDatabase[id].longURL
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  let shortenURL = req.params.id; //to access :d which is entered by user in the domain bar
  let longURL = urlDatabase[shortenURL].longURL;

  if (!longURL) {
    res.send("<h1>The url you are trying to access does not exist.</h1>");
  }

  res.redirect(longURL);
}); //redirct to its longURL, using route parameter as key to find its value(longURL) in the database

app.post("/urls/:id", (req, res) => {
  //update the database, same id but different req.body.editLongURL
  const userId = req.session.user_id;
  const id = req.params.id;
  if (!urlDatabase[id]) {
    return res.send("The URL does not exist");
  }

  if (!users[userId]) {
    res.send("<h1>Please <a href='/login'>log in</a> to edit URL.<h1>");
    return;
  };

  if (urlDatabase[id].userID !== userId) {
    res.send("<h1>You are not authorised to edit.</h1>");
    return;
  }

  urlDatabase[id].longURL = req.body.editLongURL;
  res.redirect("/urls");
}
);

app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id;
  const id = req.params.id;
  
  console.log(urlDatabase[id])

  if (!urlDatabase[id]) {
    return res.send("The URL does not exist");
  }

  if (!users[userId]) {
    res.send("Please <a href='/login'>log in</a> to delete URLs.");
    return;
  };

  if (urlDatabase[id].userID !== userId) {
    res.send("<h1>You are not authorised to delete.</h1>");
    return;
  }
  
  delete urlDatabase[id]; //delete the route parameter(key) and it's value from the urlDatabase which is an object
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  // userid is to check if the user logged in, but the hacker can see the unencrypted cookie user_id's value and know the user id exist, and change the value of user_id in DevTool to skip the login page and go directly to /urls),so also need to encrypt cookies
  if (users[userId]) {
    res.redirect("/urls");
    return;
  };

  templateVars = {
    user: users[userId]
  };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = getUserByEmail(email, users);

  if (!user) {
    return res.send("403 Bad log in, Please <a href='/login'>try again</a>");
    // check if user exist
  }

  const hashedPassword = user.hashedPassword;
  if (bcrypt.compareSync(password, hashedPassword)) {
    // res.cookie("user_id", user.id);
    req.session.user_id = user.id;
    //save the encrypted user_id (cookie key)'s value as user.id
    console.log(req.session);
    res.redirect('/urls');
    return;
    //check if entered password matches with the one in users 
  } else {
    res.send("403 Bad log in, Please <a href='/login'>try again</a>");
  }


  // console.log("email", req.body.email);
  // for (let userID in users) {
  //   if (req.body.email === users[userID].email) {
  //     console.log("email exist");
  //     if (req.body.password === users[userID].password) {
  //       console.log("password matches");
  //       res.cookie("user_id", getUserByEmail(req.body.email));
  //       res.redirect("/urls");
  //     } else {
  //       console.log("password doesn't match");
  //       return res.send("403");
  //     }
  //   } else {
  //     console.log("email is not registered");
  //     return res.send("403");
  //   }
  // }

  // res.cookie("email", req.body.email);//set a cookie named username to the value submitted in the req body, "username", via the login form - in _header.ejs/input
  // res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  if (users[userId]) {
    return res.redirect("/urls");
    // if user logged in, can find it's id from req.cookies,user_id.
  };

  const templateVars = {
    user: users[userId]
  };
  res.render("register", templateVars);
});


app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync();
  const hashedPassword = bcrypt.hashSync(password, salt);

  if (!email || !password) {
    return res.send("400 Email or password should not be empty, please <a href='/register'>try again</a>");
  }

  if (getUserByEmail(email, users)) {
    return res.send("400 User exists, please <a href='/register'>try again</a>");
  }

  const id = generateRandomString();
  const user = { id, email, hashedPassword };
  users[id] = user;
  // added new user into users database
  // console.log(users);

  // res.cookie("user_id", id);
  // set cookie user_id 's value as the random generated id
  //But because the cookie user_id is not encrypted, people can see the user_id cookie value in the DevTool, meaning the user exists, and use that to log in without going through log in page, using %curl POST

  req.session.user_id = users[id].id;
  // set encrypted cookies

  return res.redirect("/urls");

  // if (req.body.email.length === 0 || req.body.password.length === 0) {
  //   res.send("400");
  //   return;
  // };

  // const inputEmail = req.body.email;
  // for (let userID in users) {
  //   if (inputEmail === users[userID].email) {
  //     res.send("400");
  //     return;
  //   }
  // };
  // // if the entered email already exist, return 400

  // const userRandomID = generateRandomString();
  // users[userRandomID] = {
  //   id: userRandomID,
  //   email: req.body.email,
  //   password: req.body.password
  // };
  // res.cookie("user_id", userRandomID);
  // res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  // res.clearCookie("user_id");
  req.session = null;
  //clear session(encrypted cookies)
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port${PORT}!`);
});