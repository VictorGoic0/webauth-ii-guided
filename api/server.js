const express = require("express");
const helmet = require("helmet");
const knexConfig = require("../database/dbConfig.js");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const authRouter = require("../auth/auth-router.js");
const usersRouter = require("../users/users-router.js");

const server = express();

const sessionConfig = {
  name: "monster",
  secret: "keep it secret, keep it salty",
  cookie: {
    maxAge: null,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
  store: new KnexSessionStore({
    knex: knexConfig,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 30 // Delete expired sessions
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use("/api/auth", authRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.send("It's alive!");
});

module.exports = server;
