console.log('Default Parameters');

function multiply1 (x, y) {
    if (typeof y === 'undefined')
    y = 1;

    return x*y;
}

console.log('multiply1', multiply1(5));