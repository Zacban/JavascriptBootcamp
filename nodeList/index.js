#!/usr/bin/env node

const fs = require('node:fs');

fs.readdir(process.cwd(), (err, filenames) => {
    if (err) {
        console.log('An error occured', err);
        return;
    }

    // BAD CODE
    // files.forEach(file => {
    //     fs.lstat(`${process.cwd()}/${file}`, (err, stats) => {
    //         console.log(file, stats.isDirectory());

    //     });
    // });
    // END BAD CODE

    // Solution 1  Callback Based
    const allStats = Array(filenames.length).fill(null);
    for (let filename of filenames) {
        const index = filenames.indexOf(filename);

        fs.lstat(filename, (err, stats) => {
            if (err) {
                console.log('ERROR in lstat', err);
            }

            allStats[index] = stats;

            const ready = allStats.every((stats) => {
                return stats;
            });

            if (ready) {
                console.log(`listing directory: ${process.cwd()}`)
                allStats.forEach((stats, index) => {
                    console.log('- ', filenames[index], stats.isFile());
                });
            }
        });
    }
});