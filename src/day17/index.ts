import { readByLine } from "../utils";

interface Rock {
  left: number; // Horizontal index of left most
  bottom: number; // How far away from top of rock
  width: number;
  height: number;
  heights: number[]; // Height of each column
}

const rocks: Rock[] = [
  {
    // -
    left: 2,
    bottom: 3,
    width: 4,
    height: 1,
    heights: [1, 1, 1, 1],
  },
  {
    left: 2,
    bottom: 3,
    width: 3,
    height: 3,
    heights: [2, 3, 2], // Special +, careful!!
  },
  {
    left: 2,
    bottom: 3,
    width: 3,
    height: 3,
    heights: [1, 1, 3], // Flipped L, careful!!
  },
  {
    // |
    left: 2,
    bottom: 3,
    width: 1,
    height: 4,
    heights: [4],
  },
  {
    // []
    left: 2,
    bottom: 3,
    width: 2,
    height: 2,
    heights: [2, 2],
  },
];

const parseData = (data: string[]) => {
  return data[0];
};

const fallRocks = (amount: number, jets: string) => {
  const stack: string[][] = [];
  let rockIdx = 0,
    jetIdx = 0;
  while (amount) {
    const rock: Rock = { ...rocks[rockIdx] };
    rock.bottom += stack.length;
    // Push and fall until rest
    while (true) {
      // Move horizontally
      if (jets[jetIdx] === ">") {
        const right = rock.left + rock.width;
        if (right < 7) {
          // Check other parts of the shape
          if (rockIdx === 1) {
            let mark = true;
            if (
              stack.length > rock.bottom + 2 &&
              stack[rock.bottom + 2][right - 1] === "#"
            ) {
              mark = false;
            }
            if (
              stack.length > rock.bottom &&
              stack[rock.bottom][right - 1] === "#"
            ) {
              mark = false;
            }
            if (
              stack.length > rock.bottom + 1 &&
              stack[rock.bottom + 1][right] === "#"
            ) {
              mark = false;
            }
            if (mark) {
              rock.left += 1;
            }
          } else {
            let mark = true;
            for (let i = 0; i < rock.heights[rock.width - 1]; i++) {
              if (
                stack.length > rock.bottom + i &&
                stack[rock.bottom + i][right] === "#"
              ) {
                mark = false;
              }
            }
            if (mark) {
              rock.left += 1;
            }
          }
        }
      } else {
        const left = rock.left - 1;
        if (left >= 0) {
          if (rockIdx === 1) {
            let mark = true;
            if (
              stack.length > rock.bottom + 2 &&
              stack[rock.bottom + 2][left + 1] === "#"
            ) {
              mark = false;
            }
            if (
              stack.length > rock.bottom &&
              stack[rock.bottom][left + 1] === "#"
            ) {
              mark = false;
            }
            if (
              stack.length > rock.bottom + 1 &&
              stack[rock.bottom + 1][left] === "#"
            ) {
              mark = false;
            }
            if (mark) {
              rock.left -= 1;
            }
          } else if (rockIdx === 2) {
            let mark = true;
            if (
              stack.length > rock.bottom + 2 &&
              stack[rock.bottom + 2][left + 2] === "#"
            ) {
              mark = false;
            }
            if (
              stack.length > rock.bottom + 1 &&
              stack[rock.bottom + 1][left + 2] === "#"
            ) {
              mark = false;
            }
            if (
              stack.length > rock.bottom &&
              stack[rock.bottom][left] === "#"
            ) {
              mark = false;
            }
            if (mark) {
              rock.left -= 1;
            }
          } else {
            let mark = true;
            for (let i = 0; i < rock.heights[0]; i++) {
              if (
                stack.length > rock.bottom + i &&
                stack[rock.bottom + i][left] === "#"
              ) {
                mark = false;
                break;
              }
            }
            if (mark) {
              rock.left -= 1;
            }
          }
        }
      }
      jetIdx = (jetIdx + 1) % jets.length;

      // Move vertically
      const bottom = rock.bottom - 1;
      if (bottom < 0) {
        break; // Rest on the floor
      }
      if (rockIdx === 1) {
        if (stack.length > bottom) {
          let mark = true;
          if (stack[bottom][rock.left + 1] === "#") {
            mark = false;
          }
          if (
            stack.length > bottom + 1 &&
            stack[bottom + 1][rock.left] === "#"
          ) {
            mark = false;
          }
          if (
            stack.length > bottom + 1 &&
            stack[bottom + 1][rock.left + 2] === "#"
          ) {
            mark = false;
          }
          if (mark) {
            rock.bottom -= 1;
          } else {
            break;
          }
        } else {
          rock.bottom -= 1;
        }
      } else {
        if (stack.length > bottom) {
          let mark = true;
          for (let i = 0; i < rock.width; i++) {
            if (stack[bottom][rock.left + i] === "#") {
              mark = false;
            }
          }
          if (mark) {
            rock.bottom -= 1;
          } else {
            break; // Rest over some rocks
          }
        } else {
          rock.bottom -= 1;
        }
      }
    }

    // Draw the rock
    if (stack.length < rock.bottom + rock.height) {
      let i = rock.bottom + rock.height - stack.length;
      while (i) {
        stack.push(new Array(7).fill("."));
        i--;
      }
    }
    if (rockIdx === 1) {
      stack[rock.bottom][rock.left + 1] = "#";
      stack[rock.bottom + 1][rock.left] = "#";
      stack[rock.bottom + 1][rock.left + 1] = "#";
      stack[rock.bottom + 1][rock.left + 2] = "#";
      stack[rock.bottom + 2][rock.left + 1] = "#";
    } else if (rockIdx === 2) {
      stack[rock.bottom][rock.left] = "#";
      stack[rock.bottom][rock.left + 1] = "#";
      stack[rock.bottom][rock.left + 2] = "#";
      stack[rock.bottom + 1][rock.left + 2] = "#";
      stack[rock.bottom + 2][rock.left + 2] = "#";
    } else {
      for (let i = 0; i < rock.height; i++) {
        for (let j = 0; j < rock.width; j++) {
          stack[rock.bottom + i][rock.left + j] = "#";
        }
      }
    }

    amount--;
    rockIdx = (rockIdx + 1) % 5;
  }

  return stack.length;
};

export const solution = (data: string[]) => {
  const parsedData = parseData(data);

  const res1 = fallRocks(2022, parsedData);
  console.log(">>> Part 1:", res1);

  // ** To be changed *
  const res2 = fallRocks(1000000000000, parsedData)
  console.log('>>> Part 2:', res2);
  return [
    res1,
    // res2,
  ];
};

const data = readByLine("./day17/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
