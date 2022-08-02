const { readdirSync, statSync } = require('fs');
const client = require('../../index');

module.exports = class Utils {

    /**
     * The Utils constructor
     * @param {client} client The client
     * @constructor
     */

    constructor(client) {
        this.client = client;
    };

    /**
     * Get files in infinite underlaying directories.
     * @param {string} path The path
     * @returns {string[]} The files path
     * @example
     * const files = getFiles('./home/user/Desktop/');
     * 
     * console.log(files);
     * // -> ["./home/user/Desktop/file.txt", "./home/user/Desktop/file2.txt"]
     */

    getFiles(path) {

        const files = readdirSync(path);

        let result = [];

        for (const file of files) {
            const filePath = `${path}/${file}`;

            if (statSync(filePath).isDirectory()) result = result.concat(this.getFiles(filePath));
            else result.push(filePath);
        };

        return result;
    };
};