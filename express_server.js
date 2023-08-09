const express = require('express');
const { redirect } = require('express/lib/response');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true})); 
// in order to use request.body from a post method, to parse the data to be readable for humans. The body-parse library will convert the request body from a Buffer into string.

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomId = "";
  while(randomId.length < 6) {
    let index = Math.floor(Math.random() * characters.split('').length);
    randomId += characters.split('')[index];
  };
  return randomId;
}

app.get("/", (request, response) => {//get in order to see your response! get is to get whatever info on the webpage when you first landed on the page.
  response.send("Hello!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/hello", (request, response) => {
  response.send("<html><body>Hello <b>Word</b></body></html>\n");
});

app.get("/urls", (request, response) => {
  const templateVars = {urls: urlDatabase}; //the variable needs to be inside an object so we can access values through keys
  response.render('urls_index', templateVars); //('the template to show HTML on the /urls web page', the variable whose value is an object to be referenced in the template)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
})

app.post("/urls", (req, res) => {
  let id = generateRandomString();
  urlDatabase[id] = req.body.longURL; //save the id = longURL pair in urldatabase. longURL is from urls_news.ejs, input/name
  console.log(req.body); // need to use the Express library's body parsing middleware to make the request.body hunmanreadable
  
  res.redirect(`/u/${id}`); //when received a post request to /urls, it redirects to /urls/new id
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
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
})

app.listen(PORT, () => {
  console.log(`Example app listening on port${PORT}!`);
});