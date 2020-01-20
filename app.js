
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./Routes/routes-auth');
const steamRoutes = require('./Routes/steam-auth-routes');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const SteamUser = require('./Models/steam');

const app = express();

mongoose.connect(process.env.MONGO_CONNECTION_LINK,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

passport.use(new SteamStrategy({
  returnURL: 'http://localhost:5000/api/auth/steam/return',
  realm: 'http://localhost:5000/',
  apiKey: '18CFB98847781953BB031EA9DC0093D9'
},
  async function (identifier, profile, done) {
    profile.identifier = identifier;

      let user = await SteamUser.findOne({ steamid: profile.id });
      console.log(profile.id)
      if (!user) {
        user = await new SteamUser({
          id: profile.id,
          name: profile._json.personaname,
          avatar: profile._json.avatar,
          steamid: profile._json.steamid
        }).save();
      }
      return done(null, user);
  }
));

app.use(passport.initialize());

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/auth', steamRoutes);


module.exports = app;