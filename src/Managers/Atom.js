const { Client, version } = require('discord.js');

module.exports = class Atom extends Client {

    /**
     * The Atom constructor.
     * @param {Client.options} options The options
     */

    constructor(options) {
        super(options);
    };

    progressBar = new (require('@seyioo/progressbar.js'))(4, ['█', '░'], ['▏', '▕']);

    config = require('../../config.json');
    utils = new (require('./Utils'))(this);
    logger = new (require('./Logger'))(this);
    
    /**
     * Check all things to check.
     * @param {boolean} boolean The boolean
     * @returns {true}
     */

    verifications() {
        this.progressBar.reload();
        this.logger.loading('Checking packages versions...');

        if (version !== require('../../package.json').dependencies['discord.js'].replace(/\^/g, '')) this.logger.throw(`Discord.JS -> Needed version: ${require('../../package.json').dependencies['discord.js']}`);
        
        this.progressBar.next();
        this.logger.success('All packages are updated.\n');

        this.progressBar.reload();
        this.logger.loading('Checking client properties...');

        if (!this.config) this.logger.throw('Config -> Property not found.');
        if (!this.utils) this.logger.throw('Utils -> Property not found.');
        
        this.progressBar.next();
        this.logger.success(`All properties exist.\n`);

        return true;
    };

    /**
     * Log-in Atom Status.
     * @returns {true}
     */

    loadClient() {
        this.progressBar.reload();
        this.logger.loading('Connecting Atom to the Discord API...');

        this.login(this.config.token);

        return true;
    };

    /**
     * Load all Events.
     * @returns {true}
     */

    loadEvents() {
        this.progressBar.reload();
        this.logger.loading('Loading Events...');
        
        const filesPath = this.utils.getFiles('./src/Listeners');

        for (const path of filesPath) {
            const event = new (require(`../../${path}`))(this);

            if (!event.run || !event.config || !event.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            switch (path.match(/\w{0,255}\/(\w{0,252}\.js)$/g)[0].split('/')[0]) {
                case 'Process':
                    process.on(event.config.name, (...args) => event.run(...args));
                break;
                default:
                    this.on(event.config.name, (...args) => event.run(...args));
                break;
            };

            this.progressBar.reload();
            this.logger.success(`"${event.config.name}" Event has been loaded.\n`);
        };

        this.progressBar.next();
        this.logger.success(`${this._eventsCount} Events has been loaded.\n`);
    
        return true;
    };

    /**
     * Load Atom Eval.
     * @returns {true}
     */

    loadAtomEval() {
        process.stdin.resume();
        process.stdout.write('➜ ');
        
        process.stdin.on('data', async (data) => {
            process.stdin.pause();

            data = data.toString().trim();

            switch (data) {
                case '.clear':
                    console.clear();
                break;
                case '.exit':
                    process.stdin.removeAllListeners('data');
                    process.stdin.pause();

                    return console.log(`\n${'[Eval]'.blue} Exit successfully.\n`);
                break;
                case '.help':
                    console.log(`\n${`.help`.blue} ➜ See the help\n${`.clear`.blue} ➜ Clear the console\n${`.exit`.blue} ➜ Exit the eval\n`);
                break;
                default:
                        const result = new Promise((res) => res(eval(data)));
        
                        await result
                        .then((output) => {
                            console.log(`\n${'[Eval]'.blue} ${require('util').inspect(output, { depth: 0 })}\n`);
                        })
                        .catch((error) => {
                            console.log(`\n${'[Eval]'.red} ${error}\n`);
                        });
                break;
            };

            process.stdin.resume();
            process.stdout.write('➜ ');
        });

        return true;
    };

    /**
     * Init Atom Status.
     * @returns {true}
     */

    async init() {
        await this.verifications();
        await this.loadEvents();
        await this.loadClient();

        return true;
    };
};