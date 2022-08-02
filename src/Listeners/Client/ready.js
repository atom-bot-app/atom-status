const Event = require('../../Managers/Structures/Event');
const { EmbedBuilder } = require('discord.js');
const { get } = require('axios');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
    };
    
    async run () {
        this.client.progressBar.next();
        this.client.logger.default(`➜ Version: ${`${this.client.config.version}`.yellow}\n➜ ID: ${`${this.client.user.id}`.yellow}\n➜ Guilds: ${`${this.client.guilds.cache.size.toLocaleString('en-US')}`.yellow}\n➜ Events: ${`${this.client._eventsCount.toLocaleString('en-US')}`.yellow}\n`);

        this.client.logger.success('Starting status process...\n');

        const channel = await this.client.channels.fetch(this.client.config.channel);

        if (!channel) this.client.logger.error('Cannot find channel.');
        
        const message = (await channel.messages.fetch({ limit: 1 })).first();
        
        const atom = await channel.guild.members.fetch(this.client.config.id);

        setInterval(async () => {
            if (!message || message.author.id !== this.client.user.id) channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setImage(this.client.config.images.status)
                    .setColor(this.client.config.embeds.color),
                    new EmbedBuilder()
                    .setAuthor({
                        name: atom.user.username,
                        iconURL: atom.user.displayAvatarURL()
                    })
                    .setDescription(`
                        > **Atom:** ${atom.presence.status === 'online' ? this.client.config.emojis.yes : this.client.config.emojis.no}
                        > **API:** ${get('http://atom.tlkoe.xyz/public').then(() => this.client.config.emojis.yes).catch(() => this.client.config.emojis.no)}
                    `)
                    .setFooter({
                        text: this.client.config.embeds.footer,
                        iconURL: atom.user.displayAvatarURL()
                    })
                    .setColor(this.client.config.embeds.color)
                ]
            })
            .catch(() => 0);
            
            message.edit({
                embeds: [
                    new EmbedBuilder()
                    .setImage(this.client.config.images.status)
                    .setColor(this.client.config.embeds.color),
                    new EmbedBuilder()
                    .setAuthor({
                        name: atom.user.username,
                        iconURL: atom.user.displayAvatarURL()
                    })
                    .setDescription(`
                        > **Atom:** ${atom.presence.status === 'online' ? this.client.config.emojis.yes : this.client.config.emojis.no}
                        > **API:** ${await get('http://atom.tlkoe.xyz/public').then(() => this.client.config.emojis.yes).catch(() => this.client.config.emojis.no)}
                    `)
                    .setFooter({
                        text: this.client.config.embeds.footer,
                        iconURL: atom.user.displayAvatarURL()
                    })
                    .setColor(this.client.config.embeds.color)
                ]
            })
            .catch(() => 0);
        }, 10000);

        switch (process.argv[3]) {
            case 'eval':
                this.client.loadAtomEval();

                this.client.logger.success('Loading as eval mode.');
            break;
        };
    };
};