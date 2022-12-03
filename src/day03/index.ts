import { readByLine, sumArray, sortAndReduceString } from "../utils";

const parseData = (data: string[]) => {
  return data.map((line) => {
    const half = line.length / 2;
    return [line.slice(0, half), line.slice(half)];
  });
};

const parseData2 = (data: string[]) => {
  let counter = 1;
  const groups = [];
  for (const line of data) {
    if (counter === 1) {
      groups.push([line]);
    } else {
      groups[groups.length - 1].push(line);
    }
    counter++;
    if (counter > 3) counter = 1;
  }
  return groups;
};

const findCommonLetter = (strs: string[]) => {
  const dict: Record<string, number> = {};
  strs.forEach((str) => {
    const reduced = sortAndReduceString(str, 1)
    for (const c of reduced) {
      if (c in dict) {
        dict[c] += 1;
      } else {
        dict[c] = 1;
      }
    }
  });
  return Object.keys(dict).find((key) => dict[key] === strs.length) || "";
};

const getCommonItems = (groups: string[][]) => {
  return groups.map((group) => {
    const item = findCommonLetter(group);
    return itemToPriors(item)
  })
}

const itemToPriors = (item: string) => {
  if (item >= "a" && item <= "z") return item.charCodeAt(0) - 96;
  return item.charCodeAt(0) - 64 + 26;
};

export const solution = (data: string[]) => {
  const parsedData = parseData(data);
  const commonItems = getCommonItems(parsedData);
  const res1 = sumArray(commonItems);
  console.log(">>> Part 1:", res1);

  const parsedData2 = parseData2(data);
  const badges = getCommonItems(parsedData2);
  const res2 = sumArray(badges);
  console.log('>>> Part 2:', res2);
  return [res1, res2];
};

const data = readByLine("./day03/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
