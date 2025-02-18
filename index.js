const fs = require('fs');
const Discord = require('discord.js');
const backup = require('discord-backup-modified');
const config = require('./config.json');

const backups = `${__dirname}/backups`;
if (!fs.existsSync(backups)) {
    fs.mkdirSync(backups);
}
backup.setStorageFolder(backups);

const client = new Discord.Client();

client.config = config;

/* Load all events */
fs.readdir("./events/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        console.log(`👌 Event loaded: ${eventName}`);
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

client.commands = new Discord.Collection();

/* Load all commands */
fs.readdir("./commands/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
        console.log(`👌 Command loaded: ${commandName}`);
    });
});

// Login
client.login(config.token);
