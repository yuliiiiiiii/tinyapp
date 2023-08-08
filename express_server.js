const express = require('express');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port${PORT}!`);
});