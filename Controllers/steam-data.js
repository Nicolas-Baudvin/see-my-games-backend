const axios = require('axios');
const link = "http://api.steampowered.com/";

exports.games = (req, res, next) => {
    const steamid = req.params.steamid;
    axios({
        method: 'get',
        url: `${link}IPlayerService/GetOwnedGames/v0001/?key=${process.env.API_KEY}&steamid=${steamid}&format=json`,
    })
    .then(res => {
        console.log(res.data);
        res.status(200).json({message: "Envoie des jeux"})
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({err});
    })
}

exports.summaries = (req, res, next) => {
    const steamid = req.params.steamid;
    axios({
        method: 'get',
        url: `${link}ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.API_KEY}&steamids=${steamid}`
    })
}

exports.game = (req, res, next) => {
    const appid = req.params.appid;

    axios({
        method: 'get',
        url: `https://store.steampowered.com/api/appdetails?l=french&appids=${appid}`
    })
    .then(res => {
        console.log(res.data);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({err});
    })
}