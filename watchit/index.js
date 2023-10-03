#!/usr/bin/env node

import chokidar from 'chokidar';
import debounce from 'lodash.debounce';
import program from 'caporal';
import fs from 'fs';
import { spawn } from 'child_process';
import chalk from 'chalk';

program
    .version('1.0.0')
    .argument('[filename]', 'Name of a file to execute')
    .action(async ({ filename }) => {
        const name = filename || 'index.js';

        try {
            await fs.promises.access(name);
        }
        catch (err) {
            throw new Error(`Could not find file: ${name}`);
        }

        let childprocess;
        const start = debounce(() => {
            if (childprocess)
                childprocess.kill();

                console.log(chalk.yellow('>>>> Process Started'));
            childprocess = spawn('node', [name], { stdio: 'inherit' });
        }, 100);

        chokidar.watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink', start);
    });

program.parse(process.argv);