const express = require ('express');
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
})

app.get("/hello", (request, response) => {
  response.send("<html><body>Hello <b>Word</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port${PORT}!`);
});