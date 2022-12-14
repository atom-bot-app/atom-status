require('colors');

const Atom = require('./src/Managers/Atom');
const { GatewayIntentBits } = require('discord.js');

const client = new Atom({
    intents: Object.keys(GatewayIntentBits)
});

client.init();

module.exports = client;

setInterval(() => {
    if (!client.uptime) client.loadClient(true);
}, 60000);