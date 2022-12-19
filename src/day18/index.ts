import { readByLine } from "../utils";

const parseData = (data: string[]) => {
  const cubes: number[][] = [];
  let mX = 0,
    mY = 0,
    mZ = 0;
  data.forEach((line) => {
    const res = line.match(/\d+/g);
    if (!res) return;
    const [x, y, z] = res.map((i) => parseInt(i));
    cubes.push([x, y, z]);

    if (x > mX) {
      mX = x;
    }
    if (y > mY) {
      mY = y;
    }
    if (z > mZ) {
      mZ = z;
    }
  });
  return { cubes, mX, mY, mZ };
};

const getTotalSides = (
  cubes: number[][],
  mX: number,
  mY: number,
  mZ: number
) => {
  const grid: boolean[][][] = new Array(mX + 1)
    .fill(0)
    .map((x) =>
      new Array(mY + 1).fill(0).map((y) => new Array(mZ + 1).fill(false))
    );
    
  cubes.forEach(([x, y, z]) => {
    grid[x][y][z] = true;
  });

  let sides = cubes.length * 6;
  cubes.forEach(([x, y, z]) => {
    if (x - 1 >= 0 && grid[x - 1][y][z]) sides--;
    if (x + 1 <= mX && grid[x + 1][y][z]) sides--;
    if (y - 1 >= 0 && grid[x][y - 1][z]) sides--;
    if (y + 1 <= mY && grid[x][y + 1][z]) sides--;
    if (z - 1 >= 0 && grid[x][y][z - 1]) sides--;
    if (z + 1 <= mZ && grid[x][y][z + 1]) sides--;
  });
  return sides;
};

// Get air pockets inside
// Get their total sides
// Subtract
const getAirPockets = (
  cubes: number[][],
  mX: number,
  mY: number,
  mZ: number
) => {
  // #: cube, -: outside
  // Add an outer layer
  const grid: string[][][] = new Array(mX + 3)
    .fill(0)
    .map((x) =>
      new Array(mY + 3).fill(0).map((y) => new Array(mZ + 3).fill("?"))
    );
  cubes.forEach(([x, y, z]) => {
    grid[x + 1][y + 1][z + 1] = "#";
  });

  const q = [[0, 0, 0]];
  // !: in queue
  while (q.length) {
    const inspect = q.shift();
    if (!inspect) break;
    const [x, y, z] = inspect;
    grid[x][y][z] = "-";

    if (x - 1 >= 0 && grid[x - 1][y][z] === "?") {
      q.push([x - 1, y, z]);
      grid[x - 1][y][z] = "!";
    }
    if (x + 1 <= mX + 2 && grid[x + 1][y][z] === "?") {
      q.push([x + 1, y, z]);
      grid[x + 1][y][z] = "!";
    }
    if (y - 1 >= 0 && grid[x][y - 1][z] === "?") {
      q.push([x, y - 1, z]);
      grid[x][y - 1][z] = "!";
    }
    if (y + 1 <= mY + 2 && grid[x][y + 1][z] === "?") {
      q.push([x, y + 1, z]);
      grid[x][y + 1][z] = "!";
    }
    if (z - 1 >= 0 && grid[x][y][z - 1] === "?") {
      q.push([x, y, z - 1]);
      grid[x][y][z - 1] = "!";
    }
    if (z + 1 <= mZ + 2 && grid[x][y][z + 1] === "?") {
      q.push([x, y, z + 1]);
      grid[x][y][z + 1] = "!";
    }
  }

  const airPockets: number[][] = [];
  for (let x = 0; x < mX + 3; x++) {
    for (let y = 0; y < mY + 3; y++) {
      for (let z = 0; z < mZ + 3; z++) {
        if (grid[x][y][z] === "?") {
          airPockets.push([x - 1, y - 1, z - 1]);
        }
      }
    }
  }
  return airPockets;
};

export const solution = (data: string[]) => {
  const { cubes, mX, mY, mZ } = parseData(data);

  const res1 = getTotalSides(cubes, mX, mY, mZ);
  console.log(">>> Part 1:", res1);

  const airPockets = getAirPockets(cubes, mX, mY, mZ);
  const airPocketsSides = getTotalSides(airPockets, mX, mY, mZ);
  const res2 = res1 - airPocketsSides;
  console.log(">>> Part 2:", res2);
  return [res1, res2];
};

const data = readByLine("./day18/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
