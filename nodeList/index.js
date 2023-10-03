#!/usr/bin/env node

const fs = require('node:fs');
const util = require('node:util');
const chalk = require('chalk');
const path = require('node:path');

const { lstat } = fs.promises;
const log = console.log;

const targetDir = process.argv[2] || process.cwd();

fs.readdir(targetDir, async (err, filenames) => {
    if (err) {
        console.log('An error occured', err);
        return;
    }

    console.log('LISTING ASYNC FILES - Promise All');

    const statPromises = filenames.map(filename => {
        return lstat(path.join(targetDir, filename));
    });

    const allStats = await Promise.all(statPromises);

    for (let stats of allStats) {
        const index = allStats.indexOf(stats);
        if (stats.isFile()) {
            log(filenames[index]);
        }
        else {
            log(chalk.yellowBright(filenames[index]));
        }
    }
});