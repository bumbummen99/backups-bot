const backup = require('discord-backup-modified');

exports.run = async (client, message, args) => {

    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('ADMINISTRATOR')){
        return message.channel.send(':x: You need to have the manage messages permissions to create a backup in this server.');
    }

    const backupID = args.join(' ');

    backup.fetch(backupID).then(() => {

        message.channel.send(':warning: All the server channels, roles, and settings will be cleared. Do you want to continue? Send `-confirm` or `cancel`!');

        const collector = message.channel.createMessageCollector((m) => m.author.id === message.author.id && ['-confirm', 'cancel'].includes(m.content), {
            time: 60000,
            max: 1
        });
        collector.on('collect', (m) => {
            collector.stop();
            if (m.content === '-confirm') {

                backup.load(backupID, message.guild, {
                    clearGuildBeforeRestore: true,
                    maxMessagesPerChannel: 100000,
                }).then(() => {

                    return message.author.send('Backup loaded successfully!');
            
                }).catch((err) => {
            
                    if (err === 'No backup found')
                        return message.channel.send(':x: No backup found for ID '+backupID+'!');
                    else
                        return message.author.send(':x: An error occurred: '+(typeof err === 'string') ? err : JSON.stringify(err));
            
                });

            } else {
                return message.channel.send(':x: Cancelled.');
            }
        })

        collector.on('end', (collected, reason) => {
            if (reason === 'time')
                return message.channel.send(':x: Command timed out! Please retry.');
        })

    }).catch(() => {
        return message.channel.send(':x: No backup found for ID '+backupID+'!');
    });

};
