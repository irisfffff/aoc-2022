import { readByLine } from "../utils";

type Dir = "N" | "S" | "W" | "E";

const parseData = (data: string[]) => {
  const elves: number[][] = [];
  data.forEach((row, i) => {
    const s = row.split("");
    s.forEach((val, j) => {
      if (val === "#") {
        elves.push([i, j]);
      }
    });
  });
  return elves;
};

const isElfInLoc = (x: number, y: number, elves: number[][]) => {
  return !!elves.find((elf) => elf[0] === x && elf[1] === y);
};

const moveElves = (elves: number[][], order: Dir[]) => {
  let moved = false;

  // x,y as string
  const newElves: number[][] = elves.slice(0);
  const proposed = new Set<string>();
  const conflict = new Set<string>();
  // Consider move
  for (let i = 0; i < elves.length; i++) {
    const [x, y] = elves[i];
    // Does not move if no elves around
    if (
      !isElfInLoc(x - 1, y - 1, elves) &&
      !isElfInLoc(x - 1, y, elves) &&
      !isElfInLoc(x - 1, y + 1, elves) &&
      !isElfInLoc(x, y - 1, elves) &&
      !isElfInLoc(x, y + 1, elves) &&
      !isElfInLoc(x + 1, y - 1, elves) &&
      !isElfInLoc(x + 1, y, elves) &&
      !isElfInLoc(x + 1, y + 1, elves)
    ) {
      continue;
    }
    // Otherwise propose in certain diretion
    let newLoc: number[] = [];
    for (const dir of order) {
      switch (dir) {
        case "N":
          if (
            !isElfInLoc(x - 1, y - 1, elves) &&
            !isElfInLoc(x - 1, y, elves) &&
            !isElfInLoc(x - 1, y + 1, elves)
          ) {
            newLoc = [x - 1, y];
          }
          break;
        case "S":
          if (
            !isElfInLoc(x + 1, y - 1, elves) &&
            !isElfInLoc(x + 1, y, elves) &&
            !isElfInLoc(x + 1, y + 1, elves)
          ) {
            newLoc = [x + 1, y];
          }
          break;
        case "W":
          if (
            !isElfInLoc(x - 1, y - 1, elves) &&
            !isElfInLoc(x, y - 1, elves) &&
            !isElfInLoc(x + 1, y - 1, elves)
          ) {
            newLoc = [x, y - 1];
          }
          break;
        case "E":
          if (
            !isElfInLoc(x - 1, y + 1, elves) &&
            !isElfInLoc(x, y + 1, elves) &&
            !isElfInLoc(x + 1, y + 1, elves)
          ) {
            newLoc = [x, y + 1];
          }
          break;
      }
      if (newLoc.length) {
        break;
      }
    }
    if (newLoc.length) {
      newElves[i] = newLoc;
      // Check if conflict
      if (proposed.has(newLoc.join(","))) {
        conflict.add(newLoc.join(","));
      } else {
        proposed.add(newLoc.join(","));
      }
    }
  }

  // Move and update elves
  for (let i = 0; i < elves.length; i++) {
    const elf = elves[i];
    const newElf = newElves[i];
    if (elf[0] !== newElf[0] || elf[1] !== newElf[1]) {
      if (conflict.has(newElf.join(","))) {
        newElves[i] = elf;
      } else {
        moved = true;
      }
    }
  }
  return { newElves, moved };
};

export const solution = (data: string[]) => {
  const elves = parseData(data);

  const order: Dir[] = ["N", "S", "W", "E"];
  let round = 10,
    newElves = elves.slice(0);
  while (round) {
    const res = moveElves(newElves, order);
    if (!res.moved) {
      break;
    }
    newElves = res.newElves;
    const dir = order.shift() as Dir;
    order.push(dir);
    round--;
  }
  // console.log(newElves, round);
  const minX = Math.min(...newElves.map(elf => elf[0]))
  const maxX = Math.max(...newElves.map(elf => elf[0]))
  const minY = Math.min(...newElves.map(elf => elf[1]))
  const maxY = Math.max(...newElves.map(elf => elf[1]))

  // ** To be changed *
  const res1 = (maxX - minX + 1) * (maxY - minY + 1) - newElves.length;
  console.log(">>> Part 1:", res1);

  let i = 0
  const order2: Dir[] = ["N", "S", "W", "E"];
  let newElves2 = elves.slice(0);
  while(true) {
    i++
    const res = moveElves(newElves2, order2);
    if (!res.moved) {
      break;
    }
    newElves2 = res.newElves;
    const dir = order2.shift() as Dir;
    order2.push(dir);
  }
  // ** To be changed *
  const res2 = i
  console.log('>>> Part 2:', res2);
  return [
    res1,
    res2,
  ];
};

const data = readByLine("./day23/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
