import { readFileSync } from "fs";

export const readByLine = (filename: string) => {
  return readFileSync(filename).toString().split(/\n/);
};

export const sumArray = (arr: number[]) => arr.reduce((pre, cur) => pre + cur);

export const multiplyArray = (arr: number[]) =>
  arr.reduce((pre, cur) => pre * cur);

// Quick Sort
const partition = (arr: Array<any>, start: number, end: number) => {
  // Taking the last element as the pivot
  const pivotValue = arr[end];
  let pivotIndex = start;
  for (let i = start; i < end; i++) {
    if (arr[i] < pivotValue) {
      // Swapping elements
      [arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
      // Moving to next element
      pivotIndex++;
    }
  }

  // Putting the pivot value in the middle
  [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]];
  return pivotIndex;
};

export const quickSortRecursive = (
  arr: Array<any>,
  start: number,
  end: number
) => {
  // Base case or terminating case
  if (start >= end) {
    return;
  }

  // Returns pivotIndex
  let index = partition(arr, start, end);

  // Recursively apply the same logic to the left and right subarrays
  quickSortRecursive(arr, start, index - 1);
  quickSortRecursive(arr, index + 1, end);
};
