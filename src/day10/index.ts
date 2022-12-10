import { readByLine, sumArray, get2DArray } from "../utils";

const parseData = (data: string[]) => {
  const instructions = [];
  for (const instruction of data) {
    instructions.push("noop");
    if (instruction !== "noop") {
      instructions.push(instruction);
    }
  }
  return instructions;
};

const getX = (
  X: number,
  start: number,
  end: number,
  instructions: string[]
) => {
  let duringX = X;
  for(let i = start; i < end; i++) {
    duringX = X
    if(instructions[i] === 'noop') {
      continue
    }
    const addx = parseInt(instructions[i].split(' ')[1])
    X += addx
  }
  return [X, duringX];
};

const getTotalSignalStrength = (instructions: string[]) => {
  let X = 1;
  const [afterX, duringX] = getX(X, 0, 20, instructions);
  X = afterX
  const strengths = [duringX * 20];
  for (let i = 1; i <= 5; i++) {
    const [afterX, duringX] = getX(X, i * 40 - 20, 20 + i * 40, instructions);
    X = afterX
    strengths.push(duringX * (20 + i * 40));
  }
  return sumArray(strengths);
};

const drawCRT = (instructions: string[]) => {
  let X = 1, durX = 1;
  const graph = get2DArray(6, 40, '.')
  for(let i = 0; i < 6; i++) {
    for(let j = 0; j < 40; j++) {
      const res = getX(X, i * 40 + j, i * 40 + j + 1, instructions)
      X = res[0]
      durX = res[1]
      if (j >= durX - 1 && j <= durX + 1) {
        graph[i][j] = '#'
      }
    }
  }
  graph.forEach(row => console.log(row.join('')))
}

export const solution = (data: string[]) => {
  const instructions = parseData(data);

  const res1 = getTotalSignalStrength(instructions);
  console.log(">>> Part 1:", res1);

  console.log('>>> Part 2:');
  drawCRT(instructions)
  return [
    res1,
  ];
};

const data = readByLine("./day10/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
