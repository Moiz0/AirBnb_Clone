const express = require("express");
const app = express();
const session = require("express-session");



app.use(
  session({ secret: "mysupersecret", resave: false, saveUninitialized: true })
);



app.get("/test", (req, res) => {
  if (req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send(`You sent req ${req.session.count} times!`);
});

app.listen(3000, () => {
  console.log("Server is Listening");
});
