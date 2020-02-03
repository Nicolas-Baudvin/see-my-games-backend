const axios = require("axios");
const link = "http://api.steampowered.com/";
const Game = require("../Models/game");
const User = require("../Models/user");

exports.games = (req, res, next) => {
    const { steamid, ownerId } = req.params;

    axios({
        "method": "get",
        "url": `${link}IPlayerService/GetOwnedGames/v0001/?key=${process.env.API_KEY}&include_appinfo=true&steamid=${steamid}&format=json`
    })
        .then((response) => {
            response.data.response.games.forEach((game) => {
                new Game({
                    "name": game.name,
                    "playtime_forever": game.playtime_forever,
                    "header_img": `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg?t=1571756795`,
                    "appid": game.appid,
                    "ownerId": ownerId,
                    "hand_added": false,
                    "platform": "steam"
                }).save()
                    .then(() => {
                        // jeu enregistré
                    })
                    .catch((err) => {
                        res.status(500).json({ err });
                    });
            });

            User.updateOne({ "_id": ownerId }, { "imported_games": true })
                .then(() => {
                    User.findOne({ "_id": ownerId })
                        .then((user) => {
                            if (!user) {
                                return res.status(400).json({ "message": "Aucun profil trouvé" });
                            }
                            res.status(200).json({ "message": `${response.data.response.game_count} jeux ont été importé.`, user });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({ err });
                        });
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ err });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ err });
        });
};

exports.summaries = (req, res, next) => {
    const { ownerId, steamid } = req.params;

    axios({
        "method": "get",
        "url": `${link}ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.API_KEY}&steamids=${steamid}`
    })
        .then((response) => {
            const data = response.data.response.players[0];

            User.updateOne({ "_id": ownerId }, {
                "steam_id": data.steamid,
                "steam_username": data.personaname,
                "steam_profileurl": data.profileurl,
                "steam_avatar": data.avatar,
                "steam_avatarmedium": data.avatarfull,
                "steam_avatarfull": data.avatarfull,
                "steam_realname": data.realname,
                "steam_timecreated": data.timecreated
            })
                .then(() => {
                    User.findOne({ "_id": ownerId })
                        .then((user) => {
                            if (!user) {
                                return res.status(400).json({ "message": "Aucun profil trouvé" }); res.status(400).json({ "message": "Aucun profil trouvé" });
                            }
                            user.password = undefined;
                            res.status(200).json({ "message": "Votre compte steam est désormais lié à votre compte utilisateur", "user": JSON.parse((JSON.stringify(user))) });
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(500).json({ err });
                        });

                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).json({ err });
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ err });
        });
};

exports.game = (req, res, next) => {
    const appid = req.params.appid;

    axios({
        "method": "get",
        "url": `https://store.steampowered.com/api/appdetails?l=french&appids=${appid}`
    })
        .then((response) => {
            console.log(response.data);
            res.status(200).json({ "message": "Envoie des données du jeu", "game": response.data[appid] });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ err });
        });
};

exports.recents_game = (req, res, next) => {
    const { steamid } = req.params;

    axios({
        "method": "get",
        "url": `${link}IPlayerService/GetRecentlyPlayedGames/v0001/?key=${process.env.API_KEY}&steamid=${steamid}&format=json`
    })
        .then((response) => {
            console.log(response.data);
            res.status(200).json({ "games": response.data.response.games });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ err });
        });
};
