const express = require('express');
const cookieParser = require('cookie-parser'); //Parse Cookie header into readables, and populate req.cookies with an object keyed by the cookie names
const { redirect } = require('express/lib/response');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true})); 
// in order to use request.body from a post method, to parse the data to be readable for humans. The body-parse library will convert the request body from a Buffer into string.

app.use(cookieParser()) //in order to use req.cookie

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let users = {};
//create a database to store and access users data

function generateRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomId = "";
  while(randomId.length < 6) {
    let index = Math.floor(Math.random() * characters.split('').length);
    randomId += characters.split('')[index];
  };
  return randomId;
}

app.get("/", (req, res) => {//get in order to see your response! get is to get whatever info on the webpage when you first landed on the page.
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>Word</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    id: req.params.id, 
    user: users[req.cookies.user_id],
    urls: urlDatabase}; //the variable needs to be inside an object so we can access values through keys
  res.render('urls_index', templateVars); //('the template to show HTML on the /urls web page', the variable whose value is an object to be referenced in the template)
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  }
  res.render("urls_new", templateVars);
  // the browser sends cookie data with subsequent get request
})

app.post("/urls", (req, res) => {
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL; //save the id = longURL pair in urldatabase. longURL is from urls_news.ejs, input/name
  console.log(req.body); // need to use the Express library's body parsing middleware to make the request.body hunmanreadable
  
  res.redirect(`/u/${id}`); //when received a post request to /urls, it redirects to /urls/new id
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  res.redirect(urlDatabase[req.params.id]);
}); //redirct to its longURL, using route parameter as key to find its value(longURL) in the database

app.post("/urls/:id", (req, res) => {
  //update the database, same id but different req.body.editLongURL
  let path = req.params.id;
  urlDatabase[path] = req.body.editLongURL;
  res.redirect("/urls");
}
 )

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]; //delete the route parameter(key) and it's value from the urlDatabase which is an object
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  for (let userID in users) {
    if (req.body.email === users[userID].email) {
      console.log("email exist");
      if (req.body.password === users[userID].password) {
        console.log("password matches");
        res.redirect("/urls")
      }
    } else {
      res.redirect("/register");
    }
  }

  // res.cookie("email", req.body.email);//set a cookie named username to the value submitted in the req body, "username", via the login form - in _header.ejs/input
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
})

app.get("/register", (req,res) => {
  const templateVars = {
    user: users[req.cookies.user_id]
  };
  res.render("urls_regist", templateVars);
})

app.post("/register", (req, res) => {
  const userRandomID = generateRandomString();
  users[userRandomID] = {
    id: userRandomID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie("user_id", userRandomID);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port${PORT}!`);
});