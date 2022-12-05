import { readByLine } from "../utils";

const parseData = (data: string[]) => {
  const emptyLine = data.findIndex((val) => val === "");
  const nums = data[emptyLine - 1].trim().replace(/(  )/g, "").split(" ");
  const amount = parseInt(nums.pop() ?? "0");
  const stacks = new Array(amount).fill(0).map((i) => new Array<string>());

  for (let i = emptyLine - 2; i >= 0; i--) {
    for (let j = 0; j * 4 + 1 < data[i].length; j++) {
      if (data[i][j * 4 + 1] !== " ") {
        stacks[j].push(data[i][j * 4 + 1]);
      }
    }
  }

  const reg = /move (\d+) from (\d+) to (\d+)/
  const moves: number[][] = []
  for(let i = emptyLine + 1; i < data.length; i++) {
    const match = data[i].match(reg)
    if(!match) continue
    moves.push([parseInt(match[1]), parseInt(match[2]), parseInt(match[3])])
  }
  return { stacks, moves };
};

const moveCrates = (stacks: string[][], moves: number[][]) => {
  for(const instruction of moves) {
    const [amount, from, to] = instruction
    const moved = stacks[from-1].slice(-amount).reverse()
    stacks[from-1] = stacks[from-1].slice(0, -amount)
    stacks[to-1].push(...moved)
  }
}
const moveCrates2 = (stacks: string[][], moves: number[][]) => {
  for(const instruction of moves) {
    const [amount, from, to] = instruction
    const moved = stacks[from-1].slice(-amount)
    stacks[from-1] = stacks[from-1].slice(0, -amount)
    stacks[to-1].push(...moved)
  }
}

const getTopCrates = (stacks: string[][]) => {
  let res = ''
  for(const stack of stacks) {
    res += stack[stack.length - 1]
  }
  return res
}

export const solution = (data: string[]) => {
  const {stacks, moves} = parseData(data);

  moveCrates(stacks, moves)
  const res1 = getTopCrates(stacks);
  console.log(">>> Part 1:", res1);

  const {stacks: stacks2} = parseData(data)
  moveCrates2(stacks2, moves)
  const res2 = getTopCrates(stacks2)
  console.log('>>> Part 2:', res2);
  return [
    res1,
    res2,
  ];
};

const data = readByLine("./day05/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
