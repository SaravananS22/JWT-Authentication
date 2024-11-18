const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const posts = [
  {
    username: "saravanan",
    title: "Post 1",
  },
  {
    username: "rohit",
    title: "Post 2",
  },
];

app.use(express.json());

app.get("/post", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
//   console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  // Bearer TOKEN
  if (!token)
    return res.status(401).send("Authorization header missing");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
}

app.listen(3000, () => {
  console.log(`server connected at server ${"http://localhost:3000/"}`);
});

// 400 - Bad Request - Missing parameters, invalid input, malformed syntax.
// 401 - Unauthorized - No authentication token or invalid/expired token.
// 403 - Forbidden - Valid authentication but insufficient permissions.
// 404 - Not Found - Resource or endpoint does not exist.
// 405 - Method Not Allowed - HTTP method not allowed for the requested endpoint.