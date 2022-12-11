import { readByLine, quickSortRecursive, sumArray } from "../utils";

interface Monkey {
  items: number[];
  isMultiply: boolean;
  inspectAmount: string; // number string or 'old'
  test: {
    division: number;
    ifTrue: number;
    ifFalse: number;
  };
  totalTimes: number;
}

type Methods = "+" | "*" | "^";
interface Item {
  initial: number;
  ops: { method: Methods; amount: number }[];
}
interface Monkey2 {
  items: Array<Item>;
  method: Methods;
  inspectAmount: number;
  test: {
    division: number;
    ifTrue: number;
    ifFalse: number;
  };
  totalTimes: number;
}

const parseData = (data: string[]) => {
  const monkeys: Monkey[] = [];
  for (let i = 0; i < data.length; i++) {
    // Monkey x:
    i++;
    // Starting items:
    const items = [...data[i].matchAll(/\d+/g)].map((i) => parseInt(i[0]));
    i++;
    // Operation
    let isMultiply = false,
      inspectAmount = "1";
    const reg = /  Operation: new = old (.) (\d+|old)/;
    const match = data[i].match(reg);
    if (match) {
      if (match[1] === "*") {
        isMultiply = true;
      }
      inspectAmount = match[2];
    }
    i++;
    // Test
    let division = 1;
    const match2 = data[i].match(/\d+/);
    if (match2) {
      division = parseInt(match2[0]);
    }
    i++;
    // If truelet division = 1
    let ifTrue = 0;
    const match3 = data[i].match(/\d+/);
    if (match3) {
      ifTrue = parseInt(match3[0]);
    }
    i++;
    // If false
    let ifFalse = 0;
    const match4 = data[i].match(/\d+/);
    if (match4) {
      ifFalse = parseInt(match4[0]);
    }
    i++;

    monkeys.push({
      items,
      isMultiply,
      inspectAmount,
      test: {
        division,
        ifTrue,
        ifFalse,
      },
      totalTimes: 0,
    });
  }
  return monkeys;
};

const parseData2 = (data: string[]) => {
  const monkeys: Monkey2[] = [];
  for (let i = 0; i < data.length; i++) {
    // Monkey x:
    i++;
    // Starting items:
    const items = [...data[i].matchAll(/\d+/g)].map((i) => ({
      initial: parseInt(i[0]),
      ops: [],
    }));
    i++;
    // Operation
    let method: Methods = "+",
      inspectAmount = 2;
    const reg = /  Operation: new = old (.) (\d+|old)/;
    const match = data[i].match(reg);
    if (match) {
      if (match[1] === "*") {
        method = "*";
      }
      if (match[2] !== "old") {
        inspectAmount = parseInt(match[2]);
      } else {
        method = '^'
      }
    }
    i++;
    // Test
    let division = 1;
    const match2 = data[i].match(/\d+/);
    if (match2) {
      division = parseInt(match2[0]);
    }
    i++;
    // If truelet division = 1
    let ifTrue = 0;
    const match3 = data[i].match(/\d+/);
    if (match3) {
      ifTrue = parseInt(match3[0]);
    }
    i++;
    // If false
    let ifFalse = 0;
    const match4 = data[i].match(/\d+/);
    if (match4) {
      ifFalse = parseInt(match4[0]);
    }
    i++;

    monkeys.push({
      items,
      method,
      inspectAmount,
      test: {
        division,
        ifTrue,
        ifFalse,
      },
      totalTimes: 0,
    });
  }
  return monkeys;
};

const processRound1 = (monkeys: Monkey[]) => {
  for (const monkey of monkeys) {
    while (monkey.items.length) {
      let item = monkey.items.shift() ?? 1;
      let amount = 1;
      if (monkey.inspectAmount === "old") {
        amount = item;
      } else {
        amount = parseInt(monkey.inspectAmount);
      }
      if (monkey.isMultiply) {
        item *= amount;
      } else {
        item += amount;
      }
      item = Math.floor(item / 3);
      if (item % monkey.test.division) {
        monkeys[monkey.test.ifFalse].items.push(item);
      } else {
        monkeys[monkey.test.ifTrue].items.push(item);
      }
      monkey.totalTimes++;
    }
  }
};

const runTest = (item: Item, division: number): boolean => {
  let val = item.initial
  
  for(const op of item.ops) {
    if(op.method === '*') {
      val = (val * op.amount) % division
    } else if(op.method === '^') {
      val = (val * val) % division
    } else if(op.method === '+') {
      val = (val + op.amount) % division
    }
  }
  if(val % division) {
    return false
  }
  return true
}

const processRound2 = (monkeys: Monkey2[]) => {
  for (const monkey of monkeys) {
    while (monkey.items.length) {
      let item = monkey.items.shift();
      if (!item) break;
      item.ops.push({ method: monkey.method, amount: monkey.inspectAmount });
      const res = runTest(item, monkey.test.division)
      if(res) {
        monkeys[monkey.test.ifTrue].items.push(item);
      } else {
        monkeys[monkey.test.ifFalse].items.push(item);
      }
      monkey.totalTimes++;
    }
  }
};

export const solution = (data: string[]) => {
  const monkeys = parseData(data);

  let rounds = 20;
  while (rounds) {
    processRound1(monkeys);
    rounds--;
  }

  const totalTimes1 = monkeys.map((monkey) => monkey.totalTimes);
  quickSortRecursive(totalTimes1, 0, totalTimes1.length - 1);
  const res1 =
    totalTimes1[totalTimes1.length - 1] * totalTimes1[totalTimes1.length - 2];
  console.log(">>> Part 1:", res1);

  const monkeys2 = parseData2(data);

  rounds = 10000;
  while (rounds) {
    processRound2(monkeys2);
    rounds--;
  }

  const totalTimes2 = monkeys2.map((monkey) => monkey.totalTimes);
  console.log(totalTimes2);
  quickSortRecursive(totalTimes2, 0, totalTimes2.length - 1);

  const res2 =
    totalTimes2[totalTimes2.length - 1] * totalTimes2[totalTimes2.length - 2];
  console.log(">>> Part 2:", res2);
  return [res1, res2];
};

const data = readByLine("./day11/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
