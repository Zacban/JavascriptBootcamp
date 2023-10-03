#!/usr/bin/env node

import chokidar from 'chokidar';
import debounce from 'lodash.debounce';
import program from 'caporal';

const start = debounce(() => {
    console.log('Starting Users Program');
}, 100);

chokidar.watch('.')
    .on('add', start)
    .on('change', () => console.log('FILE CHANGED'))
    .on('unlink', () => console.log('FILE UNLINKED'));