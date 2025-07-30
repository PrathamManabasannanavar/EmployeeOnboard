const db = require('./database')
const express = require('express')
// const router = require('./routes.js')
require('dotenv').config()
const session = require('express-session')
const MongoStore = require('connect-mongo');
const cors = require('cors');
const userRouter = require('./userRoutes')
const adminRouter = require('./adminRoutes')


const app = express()

// CORS middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type']
}));


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//for sessions storage
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    httpOnly: true,
    secure: true,         // Must be true for cross-site HTTPS
    sameSite: 'None'      // Must be None for cross-origin cookies
  },
}));

// app.use('/', router)
app.use('/user', userRouter)

app.use('/admin', adminRouter)

app.listen(10000, () => {
  console.log("Started the Server");
})

