import { readByLine, quickSortRecursive, sumArray } from "../utils";

type Methods = "+" | "*" | "^";
interface Item {
  value: number;
  remainders?: number[];
}
interface Monkey {
  items: Array<Item>;
  method: Methods;
  inspectAmount: number;
  division: number;
  ifTrue: number;
  ifFalse: number;
  totalTimes: number;
}

const parseData = (data: string[]) => {
  const monkeys: Monkey[] = [];
  const divisions: number[] = [];
  for (let i = 0; i < data.length; i++) {
    // Monkey x:
    i++;
    // Starting items:
    const items = [...data[i].matchAll(/\d+/g)].map((i) => ({
      value: parseInt(i[0]),
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
        method = "^";
      }
    }
    i++;
    // Test
    let division = 1;
    const match2 = data[i].match(/\d+/);
    if (match2) {
      division = parseInt(match2[0]);
      divisions.push(division);
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
      division,
      ifTrue,
      ifFalse,
      totalTimes: 0,
    });
  }
  return { monkeys, divisions };
};

const doOperation = (value: number, method: Methods, amount: number) => {
  if (method === "*") {
    return value * amount;
  } else if (method === "^") {
    return value * value;
  } else if (method === "+") {
    return value + amount;
  }
  return 0;
};

const processRound = (
  monkeys: Monkey[],
  divisions: number[],
  isTask2: boolean = false
) => {
  for (let i = 0; i < monkeys.length; i++) {
    const monkey = monkeys[i];
    while (monkey.items.length) {
      let item = monkey.items.shift();
      if (!item) break;
      let res = false;
      if (isTask2) {
        if (!item.remainders) {
          item.remainders = new Array(divisions.length).fill(item.value);
        }
        item.remainders = item.remainders.map((remainder, idx) => {
          let value = doOperation(
            remainder,
            monkey.method,
            monkey.inspectAmount
          );
          value = value % divisions[idx];
          return value;
        });
        res = !item.remainders[i];
      } else {
        item.value = doOperation(
          item.value,
          monkey.method,
          monkey.inspectAmount
        );
        item.value = Math.floor(item.value / 3);
        res = !(item.value % monkey.division);
      }
      if (res) {
        monkeys[monkey.ifTrue].items.push(item);
      } else {
        monkeys[monkey.ifFalse].items.push(item);
      }
      monkey.totalTimes++;
    }
  }
};

export const solution = (data: string[]) => {
  const { monkeys, divisions } = parseData(data);

  let rounds = 20;
  while (rounds) {
    processRound(monkeys, divisions);
    rounds--;
  }

  const totalTimes1 = monkeys.map((monkey) => monkey.totalTimes);
  quickSortRecursive(totalTimes1, 0, totalTimes1.length - 1);
  const res1 =
    totalTimes1[totalTimes1.length - 1] * totalTimes1[totalTimes1.length - 2];
  console.log(">>> Part 1:", res1);

  const { monkeys: monkeys2 } = parseData(data);
  rounds = 10000;
  while (rounds) {
    processRound(monkeys2, divisions, true);
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
