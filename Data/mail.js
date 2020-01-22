exports.mailSignup = "<h1> Bienvenue sur See My Games ! </h1> <br/> <p> Cet email confirme votre inscription à notre site See My Games. Vous pouvez désormais vous connecter sur <a alt='page login' target='_blank' href='http://localhost:3000/connexion/'> notre site </a> et utiliser ses fonctionnalités </p>";
exports.mail_confirm = (link) => {
    return `<h1> Confirmation de changement d'email </h1> <p> Vous avez demandé une modification de votre email. Pour terminer le processus, cliquez sur <a href=${link} target="_blank"> ce liens </a> </p>`;
};
exports.password_confirm = (link) => {
    return `<h1> Confirmation de changement de mot de passe </h1> <p> Vous avez demandé une modification de votre mot de passe. Pour terminer le processus, cliquez sur <a href=${link} target="_blank"> ce liens </a> </p>`;
};
exports.newsletters = (link) => {
    return `<h1> Confirmation d'inscription à la newsletter' </h1> <p> Vous avez demandé un abonnement à la newsletter. Pour terminer le processus, cliquez sur <a href=${link} target="_blank"> ce liens </a> </p>`;
};

