import { readByLine, sumArray, rotateN90 } from "../utils";

const parseData = (data: string[]) => {
  // ** To be changed *
  return data.map((row) => row.split("").map((i) => parseInt(i)));
};

const isVisibleFromLeft = (grid: number[][], visibles: number[][]) => {
  const tallestLefts = new Array(grid.length).fill(-1);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] > tallestLefts[i]) {
        visibles[i][j] = 1;
        tallestLefts[i] = grid[i][j];
      }
    }
  }
};

const findAllVisibles = (grid: number[][]) => {
  const visibles = new Array(grid.length)
    .fill(0)
    .map((row) => new Array(grid[0].length).fill(0));
  let rotatedGrid, rotatedVisibles;
  isVisibleFromLeft(grid, visibles);

  rotatedGrid = rotateN90(grid);
  rotatedVisibles = rotateN90(visibles);
  isVisibleFromLeft(rotatedGrid, rotatedVisibles);

  rotatedGrid = rotateN90(rotatedGrid);
  rotatedVisibles = rotateN90(rotatedVisibles);
  isVisibleFromLeft(rotatedGrid, rotatedVisibles);

  rotatedGrid = rotateN90(rotatedGrid);
  rotatedVisibles = rotateN90(rotatedVisibles);
  isVisibleFromLeft(rotatedGrid, rotatedVisibles);

  rotatedVisibles = rotateN90(rotatedVisibles);

  return rotatedVisibles;
};

const getScoreFromLeft = (grid: number[][], scores: number[][]) => {
  for (let i = 0; i < grid.length; i++) {
    scores[i][0] = 0
    for (let j = 1; j < grid[0].length - 1; j++) {
      const blockedLeftIdx = grid[i].slice(0, j).reverse().findIndex(item => item >= grid[i][j])
      if (blockedLeftIdx === -1) {
        scores[i][j] *= j
      } else {
        scores[i][j] *= blockedLeftIdx+1
      }
    }
  }
};

const getScenicScores = (grid: number[][]) => {
  const scores = new Array(grid.length)
    .fill(0)
    .map((row) => new Array(grid[0].length).fill(1));
  let rotatedGrid, rotatedScores;
  getScoreFromLeft(grid, scores);

  rotatedGrid = rotateN90(grid);
  rotatedScores = rotateN90(scores);
  getScoreFromLeft(rotatedGrid, rotatedScores);

  rotatedGrid = rotateN90(rotatedGrid);
  rotatedScores = rotateN90(rotatedScores);
  getScoreFromLeft(rotatedGrid, rotatedScores);

  rotatedGrid = rotateN90(rotatedGrid);
  rotatedScores = rotateN90(rotatedScores);
  getScoreFromLeft(rotatedGrid, rotatedScores);

  rotatedScores = rotateN90(rotatedScores);

  return rotatedScores;
};

export const solution = (data: string[]) => {
  const parsedData = parseData(data);

  const visibles = findAllVisibles(parsedData);
  const res1 = sumArray(visibles.map((row) => sumArray(row)));
  console.log(">>> Part 1:", res1);

  const scores = getScenicScores(parsedData)
  const res2 = Math.max(...scores.map(row => Math.max(...row)))
  console.log('>>> Part 2:', res2);
  return [
    res1,
    res2,
  ];
};

const data = readByLine("./day08/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
