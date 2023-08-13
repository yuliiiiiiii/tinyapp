const { assert } = require('chai');

const getUserByEmail = require('../helpers.js');
// unit test => just to test getUserByEmail this function

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.strictEqual(user.id, expectedUserID);
  });
  it('should return undefined if passed in an invalid email', function() {
    const result = getUserByEmail("user3@example.com", testUsers);
    const expectedResult = undefined;
    assert.strictEqual(result, expectedResult);
  });
});