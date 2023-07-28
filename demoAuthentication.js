const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

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

const authentication = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader) {
    jwtToken = authHeader.split(" ")[1];
  }

  if (jwtToken) {
    jwt.verify(jwtToken, "SECRET_KEY", (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.username = payload.username;
        request.userId = payload.userId;
        next();
      }
    });
  } else {
    response.status(400);
    response.send("JWT Token is missing");
  }
};


// POST (userRegister)

app.post("/register/", async (request, response) => {
  const { username, password, name, gender } = request.body;
  const getUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
  const userDBDetails = await db.get(getUserQuery);

  if (userDBDetails !== undefined) {
    response.status(400);
    response.send("User already exists");
  } else {
    if (password.length < 6) {
      response.status(400);
      response.send("Password is too short");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createUserQuery = `INSERT INTO user(username,password,name,gender)
       VALUES('${username}','${hashedPassword}','${name}','${gender}');`;
      await db.run(createUserQuery);
      response.send("User created successfully");
    }
  }
});

// POST (userLogin)

app.post("/login/", async (request, response) => {
  const { username, password } = request.body;
  const getUserQuery = `SELECT * FROM user WHERE username='${username}';`;
  const userDbDetails = await db.get(getUserQuery);
  if (userDbDetails !== undefined) {
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userDbDetails.password
    );

    if (isPasswordCorrect) {
      const payload = { username, userId: userDbDetails.user_id };
      const jwtToken = jwt.sign(payload, "SECRET_KEY");
      response.send({ jwtToken });
      console.log("Login Successful")
    } else {
      response.status(400);
      response.send("Invalid password");
    }
  } else {
    response.status(400);
    response.send("Invalid user");
  }
});

// GET (userDetails)

app.get("/user/details", authentication, async (request, response) => {
  const { userId, username } = request;
  const getUserQuery = `
  SELECT
    *
  FROM
    user
  WHERE
    user_id = '${userId}' AND username = '${username}';
`;
  const userDetails = await db.get(getUserQuery);
  response.send(userDetails);
  console.log(`${username} details are retreived in the response`)
});