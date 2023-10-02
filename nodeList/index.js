#!/usr/bin/env node

const fs = require('node:fs');
const util = require('node:util');

fs.readdir(process.cwd(), async (err, filenames) => {
    if (err) {
        console.log('An error occured', err);
        return;
    }

    console.log('LISTING ASYNC FILES');
    
    for (let filename of filenames) {
        try {
        const stats = await lstat(filename);

        console.log('- ', filename, stats.isFile())
        }
        catch (err) {
            console.log('ERROR', err);
        }
    }
});

// METHOD #1
const promiseLStat = (filename) => {
    return new Promise((resolve, reject) => {
        fs.lstat(filename, (err, stats) => {
            if (err)
                reject(err);

            resolve(stats);
        });
    });
}

// METHOD #2
const utilLStat = util.promisify(fs.stat);

// METHOD #3
const { lstat } = fs.promises;