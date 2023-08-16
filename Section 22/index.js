const { Engine, Render, Runner, World, Bodies } = Matter;

const worldWidth = 800;
const worldHeight = 800;
const wallThickness = 40;

const gridWidth = 3;
const gridHeight = 3;

const engine = Engine.create();

const { world } = engine;
const render = Render.create(
    {
        element: document.body,
        engine: engine,
        options: {
            wireframes: true,
            width: worldWidth,
            height: worldHeight
        }
    }
);

Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
    Bodies.rectangle((worldWidth / 2), 0, worldWidth, wallThickness, { isStatic: true }),
    Bodies.rectangle((worldWidth / 2), worldHeight, worldWidth, wallThickness, { isStatic: true }),
    Bodies.rectangle(0, worldHeight / 2, wallThickness, worldHeight, { isStatic: true }),
    Bodies.rectangle(worldWidth, worldHeight / 2, wallThickness, worldHeight, { isStatic: true })
];

World.add(world, walls);

// Maze generation

const shuffle = (arr) => {
    let counter = arr.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter--);

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;

        return arr;
    }
}
const grid = Array(gridHeight)
    .fill(null)
    .map(() => Array(gridWidth).fill(false));

const vertical = Array(gridHeight)
    .fill(null)
    .map(() => Array(gridWidth - 1).fill(false));

const horizontal = Array(gridHeight - 1)
    .fill(null)
    .map(() => Array(gridWidth).fill(false));

const startRow = Math.floor(Math.random() * gridHeight);
const startCol = Math.floor(Math.random() * gridWidth);

const stepCell = (row, column) => {
    // if we already visited this cell, then return
    if (grid[row][column] === true) {
        return;
    }

    // set value to true to indicate the cell has been visited.
    grid[row][column] = true;

    // assemble randomly-ordered list of neighbours
    const neighbours = shuffle([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ]);

    // for each neighbour
    for (let neighbour of neighbours) {
        const [nextRow, nextColumn, direction] = neighbour;

        if (nextRow < 0 || nextRow >= gridHeight || nextColumn < 0 || nextColumn >= gridWidth)
            continue;

        if (grid[nextRow][nextColumn])
            continue;

            if (direction)
    }

    console.log(`neighbours to [${row}][${column}]`, neighbours);
}

stepCell(startRow, startCol);