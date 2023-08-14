const getUserByEmail = function(email, database) {

  for (let userID in database) {
    const user = database[userID];
    if (email === user.email) {
      return user;
    }
  }
  return undefined;
};

const urlsForUser = function(userId, database) {
  const urls = {};

  const ids = Object.keys(database);
  for (const id of ids) {
    const url = database[id];
    if (url.userID === userId) {
      urls[id] = url;
    }
  }
  return urls;
};

const generateRandomString = function() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let randomId = "";
  while (randomId.length < 6) {
    let index = Math.floor(Math.random() * characters.split('').length);
    randomId += characters.split('')[index];
  };
  return randomId;
};

module.exports = { getUserByEmail, urlsForUser,generateRandomString };