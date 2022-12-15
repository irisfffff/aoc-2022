import { readByLine, sumArray } from "../utils";

const parseData = (data: string[]) => {
  return data.map((line) => {
    const reg =
      /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;
    let res = line.match(reg);
    if (!res) return [0, 0, 0, 0]; // For typing
    const pos = res.slice(1, 5).map((i) => parseInt(i));
    return pos;
  });
};

const processRow = (poses: number[][], y: number) => {
  // Right not include
  let unCoveredXs: number[][] = [];
  let minX = Infinity,
    maxX = -Infinity;
  const beaconsOnY: number[] = [];
  poses.forEach(([sensorX, sensorY, beaconX, beaconY]) => {
    if (beaconY === y && !beaconsOnY.includes(beaconX)) {
      beaconsOnY.push(beaconX);
    }
    const dis = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);
    const disY = Math.abs(sensorY - y);
    const disX = dis - disY;
    if (disX <= 0) return;
    const x0 = sensorX - disX;
    const x1 = sensorX + disX + 1;

    if (x0 >= maxX) {
      if (maxX === -Infinity) {
        minX = x0;
        maxX = x1;
        return;
      }
      if (x0 > maxX) {
        unCoveredXs.push([maxX, x0]);
      }
      maxX = x1;
      return;
    }
    if (x1 <= minX) {
      if (x1 < minX) {
        unCoveredXs.push([x1, minX]);
      }
      minX = x0;
      return;
    }
    if (x0 <= minX && x1 >= maxX) {
      minX = x0;
      maxX = x1;
      unCoveredXs = [];
      return;
    }

    for (let i = 0; i < unCoveredXs.length; ) {
      const unCoveredX = unCoveredXs[i];
      if (x0 >= unCoveredX[1] || x1 <= unCoveredX[0]) {
        i++;
        continue;
      }
      if (x0 > unCoveredX[0]) {
        const tempX1 = unCoveredX[1];
        unCoveredX[1] = x0;
        if (x1 >= unCoveredX[1]) {
          i++;
          continue;
        } else {
          unCoveredXs.splice(i, 0, [x1, tempX1]);
          i += 2;
          continue;
        }
      } else {
        if (x1 >= unCoveredX[1]) {
          unCoveredXs.splice(i, 1);
          continue;
        } else {
          unCoveredX[0] = x1;
          i++;
          continue;
        }
      }
    }
    if (x0 < minX) minX = x0;
    if (x1 > maxX) maxX = x1;
    return;
  });
  return { unCoveredXs, minX, maxX, beaconsOnY };
};

const getNoBeaconsAmountInRow = (
  unCoveredXs: number[][],
  minX: number,
  maxX: number,
  beaconsOnY: number[]
) => {
  let res = maxX - minX - beaconsOnY.length;
  for (const [x0, x1] of unCoveredXs) {
    res -= x1 - x0;
  }
  return res;
};

const findDistressBeacon = (
  unCoveredXs: number[][],
  limit: number
) => {
  for(const [x0] of unCoveredXs) {
    if (x0 >= 0 && x0 <= limit) {
      return x0;
    }
  }
  return null;
};

export const solution = (data: string[], row: number, limit: number) => {
  const poses = parseData(data);
  const { unCoveredXs, minX, maxX, beaconsOnY } = processRow(poses, row);

  const res1 = getNoBeaconsAmountInRow(unCoveredXs, minX, maxX, beaconsOnY);
  console.log(">>> Part 1:", res1);

  let y = 0,
    x = -1;
  for (; y <= limit; y++) {
    const { unCoveredXs } = processRow(poses, y);
    if(!unCoveredXs.length) {
      continue
    }
    const res = findDistressBeacon(unCoveredXs, limit)
    if(res) {
      x = res;
      break
    }
  }

  const res2 = x * 4000000 + y
  console.log('>>> Part 2:', res2);
  return [
    res1,
    res2,
  ];
};

const data = readByLine("./day15/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data, 2000000, 4000000);
}
