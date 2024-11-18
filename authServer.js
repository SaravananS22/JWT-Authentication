const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(express.json());

let refreshTokens=[];
// after token expired create new token

app.post('/token',(req,res)=>{
    const refreshToken=req.body.token;

    if(!refreshToken) return res.status(401).send('Refresh token is required');
    if(!refreshTokens.includes(refreshToken)) return res.status(403).send('Invalid refresh token');

    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(403).send('Invalid or expired refresh token');
        const accessToken=generateAccessToken({name:user.name})
        res.json({accessToken})
    })
})

app.post("/login", (req, res) => {
  // Authenticate User
  const username = req.body.username;

  if (!username) {
    return res.status(400).send('Username is required');
  }

  const user = { name: username };

  // jwt
  const accessToken = generateAccessToken(user);
  // refresh token
  const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);

  refreshTokens.push(refreshToken)

  res.json({ accessToken , refreshToken });
});

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15s'});
}

app.listen(4000, () => {
  console.log(`server connected at server ${"http://localhost:4000/"}`);
});
