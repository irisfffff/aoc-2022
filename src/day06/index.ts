import { readByLine } from "../utils";

const parseData = (data: string[]) => {
  return data.join("");
};

const findStart = (datastream: string, distinct: number) => {
  const marker = []
  for(let i = 0; i < datastream.length; i++) {
    let repeat = marker.findIndex(v => v === datastream[i])
    while(repeat >= 0) {
      marker.shift()
      repeat--
    } 
    marker.push(datastream[i])
    if(marker.length === distinct) {
      return i+1
    }
  }
}

export const solution = (data: string[]) => {
  const parsedData = parseData(data);

  const res1 = findStart(parsedData, 4);
  console.log(">>> Part 1:", res1);

  const res2 = findStart(parsedData, 14)
  console.log('>>> Part 2:', res2);
  return [
    res1,
    res2,
  ];
};

const data = readByLine("./day06/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
