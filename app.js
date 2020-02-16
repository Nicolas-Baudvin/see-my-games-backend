
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const authRoutes = require("./Routes/routes-auth");
const steamRoutes = require("./Routes/steam-auth-routes");
const gamesRoute = require("./Routes/games-routes");
const steamDataRoutes = require("./Routes/steam-data-routes");
const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const SteamUser = require("./Models/steam");
const postRoutes = require("./Routes/posts-routes");
const newsletterRoutes = require("./Routes/newsletter");

const app = express();

mongoose.connect(process.env.MONGO_CONNECTION_LINK,
    {
        "useNewUrlParser": true,
        "useUnifiedTopology": true
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

passport.use(new SteamStrategy({
    "returnURL": "https://seemygames.fr/api/auth/steam/return",
    "realm": "https://seemygames.fr/",
    "apiKey": process.env.API_KEY
},
(async (identifier, profile, done) => {
    profile.identifier = identifier;

    let user = await SteamUser.findOne({ "steamid": profile.id });

    console.log(profile.id);
    if (!user) {
        user = await new SteamUser({
            "id": profile.id,
            "name": profile._json.personaname,
            "avatar": profile._json.avatar,
            "steamid": profile._json.steamid
        }).save();
    }
    return done(null, user);
})
));

app.use(passport.initialize());

app.use(bodyParser.json());
// auth routes
app.use("/api/steam", steamDataRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", steamRoutes);

// posts routes
app.use("/api/posts", postRoutes);

// games routes
app.use("/api/games", gamesRoute);

// newsletter routes
app.use("api/newsletter", newsletterRoutes);


module.exports = app;
