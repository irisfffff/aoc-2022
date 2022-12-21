import { readByLine } from "../utils";

type Operation = "+" | "-" | "*" | "/";

interface Monkey {
  name: string;
  value?: number;
  operation?: Operation;
  a?: string;
  b?: string;
}

const parseData = (data: string[]) => {
  const map: Map<string, number> = new Map();
  const monkeys: Monkey[] = [];
  for (let i = 0; i < data.length; i++) {
    const [name, s2] = data[i].split(": ");
    const monkey: Monkey = { name };
    map.set(name, i);
    let value = s2.match(/\d+/);
    if (value) {
      monkey.value = parseInt(value[0]);
    } else {
      const reg = /([a-z]+) (\+|-|\*|\/) ([a-z]+)/;
      const match = s2.match(reg);
      if (match) {
        monkey.a = match[1];
        monkey.operation = match[2] as Operation;
        monkey.b = match[3];
      }
    }
    monkeys.push(monkey);
  }
  return { monkeys, map };
};

const getMonkeyValue = (
  name: string,
  monkeys: Monkey[],
  map: Map<string, number>
): number => {
  const monkey = monkeys[map.get(name) as number];

  if (monkey.value) {
    return monkey.value;
  } else {
    const a = getMonkeyValue(monkey.a as string, monkeys, map);
    const b = getMonkeyValue(monkey.b as string, monkeys, map);
    const operation = monkey.operation;
    switch (operation) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return a / b;
    }
  }
  return 0;
};

const getMonkeyValue2 = (
  name: string,
  monkeys: Monkey[],
  map: Map<string, number>
): [number, number] => {
  const monkey = monkeys[map.get(name) as number];
  if (name === "humn") {
    return [1, 0];
  }

  if (monkey.value) {
    return [0, monkey.value];
  } else {
    const [k1, a1] = getMonkeyValue2(monkey.a as string, monkeys, map);
    const [k2, a2] = getMonkeyValue2(monkey.b as string, monkeys, map);
    const operation = monkey.operation;
    switch (operation) {
      case "+":
        return [k1 + k2, a1 + a2];
      case "-":
        return [k1 - k2, a1 - a2];
      case "*":
        if(k1 && k2) {
          throw new Error('humn appears in both sides of multiply... Cannot handle')
        }
        return [k1 * k2 + k1 * a2 + k2 * a1, a1 * a2];
      case "/":
        if(k2) {
          throw new Error('humn appears in the divider... Cannot handle')
        }
        return [k1 / a2, a1 / a2];
    }
  }
  // kx + a
  return [0, 0];
};

export const solution = (data: string[]) => {
  const { monkeys, map } = parseData(data);

  const res1 = getMonkeyValue("root", monkeys, map);
  console.log(">>> Part 1:", res1);

  const rootMonkey = monkeys[map.get("root") as number];
  const [k1, a1] = getMonkeyValue2(rootMonkey.a as string, monkeys, map);
  const [k2, a2]= getMonkeyValue2(rootMonkey.b as string, monkeys, map);
  
    // k1 * x + a1 = k2 * x + a2
    // x = (a2 - a1) / (k1 - k2)
  const res2 = (a2 - a1) / (k1 - k2)
  console.log('>>> Part 2:', res2);
  return [
    res1,
    res2,
  ];
};

const data = readByLine("./day21/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
