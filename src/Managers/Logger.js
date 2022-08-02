const client = require('../../index');

module.exports = class Logger {

    /**
     * The logger constructor.
     * @param {client} client The client
     * @constructor
     */

    constructor(client) {
        this.client = client;
    };
    
    ascii = '    _   _                  \r\n   \/ \\ | |_ ___  _ __ ___  \r\n  \/ _ \\| __\/ _ \\| \'_ ` _ \\ \r\n \/ \/ \\ \\ || (_) | | | | | |\r\n\/_\/   \\_\\__\\___\/|_| |_| |_|\r\n                            \r';
    name = 'Atom Status';

    /**
     * Get date (HH:mm:ss).
     * @private
     */

    get date() {
        return new Date(Date.now()).toLocaleTimeString('fr-FR');
    };

    /**
     * Log with yellowed ascii.
     * @param {string} message The message
     * @returns {true}
     */

    default(message) {
        console.log(`${`${this.ascii}`.yellow}\n${message}`);

        return true;
    };

    /**
     * Log message with greened prefix.
     * @param {string} message The message
     * @returns {true}
     */

    loading(message) {
        console.log(`${`[${this.date}]`.grey} ${`[${this.name}]`.grey} ${message}`);

        return true;
    };

    /**
     * Log with greened prefix.
     * @param {string} message The message
     * @returns {true}
     */

    success(message) {
        console.log(`${`[${this.date}]`.grey} ${`[${this.name}]`.green} ${message}`);

        return true;
    };

    /**
     * Log with reddened prefix.
     * @param {String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError} message The message
     * @returns {true}
     */

    error(message) {
        if (typeof message !== 'string') message = require('util').inspect(message, { depth: 0 });

        console.log(`${`[${this.date}]`.grey} ${`[${this.name}]`.red} ${message}`);

        return true;
    };
    
    /**
     * Throw with reddened prefix.
     * @param {String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError} message The message
     * @throws
     */

    throw(message) {
        if (typeof message !== 'string') message = require('util').inspect(message, { depth: 0 });

        throw new Error(`${`[${this.date}]`.grey} ${`[${this.name}]`.red} ${message}`);
    };
};