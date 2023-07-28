const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");

const app = express();

/* PATH is a path to the file which we want to send.
_dirname is a variable in Common JS Modules that returns the 
path of the folder where the current file is present. */

const dbPath = path.join(__dirname, "twitterClone.db");
let db = null;

// initalizing db and server

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3001, () => {
      console.log("Server Running at http://localhost:3001/");
    });
  } catch (error) {
    console.log(`DB Error : ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//Check for CRUD operations

//GET METHOD
app.get("/", async (request, response) => {
  const query = `SELECT * FROM user;`;
  const getQuery = await db.all(query);
  response.send(getQuery);
});

//GET METHOD (WITH ID)
app.get("/twitter/user/:userId/", async (request, response) => {
  const { userId } = request.params;
  const getUserQuery = `
    SELECT
      *
    FROM
      user
    WHERE
      user_id = ${userId};`;
  const userDetails = await db.get(getUserQuery);
  response.send(userDetails);
});

//POST METHOD
app.post("/user/register/", async (request, response) => {
  const { username, password, name, gender } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const createUserQuery = `INSERT INTO user(username,password,name,gender)
       VALUES('${username}','${hashedPassword}','${name}','${gender}');`;
  await db.run(createUserQuery);
  response.send("User created successfully");
});

//PUT METHOD
app.put("/user/update/:userId/", async (request, response) => {
  const { userId } = request.params;
  const userDetails = request.body;
  const { username, password, name, gender } = userDetails;
  const hashedPassword = await bcrypt.hash(password, 10);
  const updateUserQuery = `
    UPDATE
      user
    SET
      name='${name}',
      username= '${username}',
      password= '${hashedPassword}',
      gender= '${gender}'
    WHERE
      user_id = ${userId};`;
  await db.run(updateUserQuery);
  response.send("User Details Updated Successfully");
});

//DELETE METHOD
app.delete("/user/delete/:userId/", async (request, response) => {
  const { userId } = request.params;
  const deleteUserQuery = `
    DELETE FROM
      user
    WHERE
      user_id = ${userId};`;
  await db.run(deleteUserQuery);
  response.send("User Details Deleted Successfully");
});
