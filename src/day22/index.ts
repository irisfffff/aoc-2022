import { readByLine, mod } from "../utils";

interface RowOrColumn {
  offset: number; // First tile from left
  tiles: string[];
}

type Dir = "R" | "D" | "L" | "U";
type Turn = "L" | "R";
interface Move {
  turn?: Turn;
  steps: number;
}

const parseData = (data: string[]) => {
  // According to input
  console.log(">>> Cube width:", data[0].length / 3);

  const maze: RowOrColumn[] = [];
  let i = 0;
  for (; data[i] !== ""; i++) {
    const s = data[i].split("");
    const offset = s.findIndex((val) => val !== " ");
    maze.push({ offset, tiles: s.slice(offset) });
  }
  const matches = data[i + 1].matchAll(/(L|R)?(\d+)/g);
  const path: Move[] = [];
  for (const match of matches) {
    path.push({ turn: match[1] as Turn, steps: parseInt(match[2]) });
  }
  return { maze, path };
};

const changeDir = (dir: Dir, turn: Turn) => {
  const dirs: Dir[] = ["R", "D", "L", "U"];
  const idx = dirs.findIndex((i) => i === dir);
  if (turn === "L") {
    return dirs[mod(idx - 1, 4)];
  } else {
    return dirs[mod(idx + 1, 4)];
  }
};

const getColumnTiles = (maze: RowOrColumn[], c: number): RowOrColumn => {
  const offset = maze.findIndex(
    (row) => row.offset <= c && row.offset + row.tiles.length - 1 >= c
  );
  let end = maze.findIndex(
    (row, idx) =>
      idx > offset && (row.offset > c || row.offset + row.tiles.length - 1 < c)
  );
  if (end === -1) {
    end = maze.length;
  }
  const tiles = maze.slice(offset, end).map((row) => row.tiles[c - row.offset]);
  return { offset, tiles };
};

const moveForward = (
  dir: Dir,
  steps: number,
  start: number,
  tiles: string[]
) => {
  if (dir === "L" || dir === "U") {
    tiles.reverse();
    start = tiles.length - 1 - start;
  }
  const wall = tiles.findIndex((val, idx) => val === "#" && idx > start);

  let stop: number = start;
  if (wall > -1) {
    if (wall - start > steps) {
      // Finish before wall
      stop = start + steps;
    } else {
      // Run into wall
      stop = wall - 1;
    }
  } else {
    if (tiles.length - 1 - start >= steps) {
      // Finish before end
      stop = start + steps;
    } else {
      steps -= tiles.length - 1 - start;
      const wall2 = tiles.findIndex((val) => val === "#");
      if (wall2 > -1) {
        if (wall2 > steps) {
          stop = steps - 1;
        } else {
          stop = wall2 - 1;
        }
      } else {
        // No wall
        stop = (steps % tiles.length) - 1;
      }
      if (stop === -1) {
        stop = tiles.length - 1;
      }
    }
  }

  if (dir === "L" || dir === "U") {
    return tiles.length - 1 - stop;
  }
  return stop;
};

const walkPath = (maze: RowOrColumn[], path: Move[]) => {
  let dir: Dir = "R";
  let r = 0;
  let c = maze[0].offset;
  for (const move of path) {
    if (move.turn) {
      dir = changeDir(dir, move.turn);
    }
    let offset: number, tiles: string[], start: number;
    if (dir === "R" || dir === "L") {
      offset = maze[r].offset;
      tiles = maze[r].tiles.slice(0);
      start = c - offset;
    } else {
      offset = maze.findIndex(
        (row) => row.offset <= c && row.offset + row.tiles.length - 1 >= c
      );
      let end = maze.findIndex(
        (row, idx) =>
          idx > r && (row.offset > c || row.offset + row.tiles.length - 1 < c)
      );
      if (end === -1) {
        end = maze.length;
      }
      tiles = maze.slice(offset, end).map((row) => row.tiles[c - row.offset]);
      start = r - offset;
    }
    const stop = moveForward(dir, move.steps, start, tiles) + offset;
    if (dir === "R" || dir === "L") {
      c = stop;
    } else {
      r = stop;
    }
  }
  return (
    (r + 1) * 1000 +
    (c + 1) * 4 +
    ["R", "D", "L", "U"].findIndex((val) => val === dir)
  );
};

const moveForward2 = (
  maze: RowOrColumn[],
  r: number,
  c: number,
  dir: Dir,
  steps: number
) => {
  // Change according to input
  // const width = 4;
  const width = 50
  // Do not consider offset with start and stop
  let offset = 0,
    tiles: string[] = [],
    start = 0,
    stop = 0;

  // Construct the current row or column
  if (dir === "R" || dir === "L") {
    offset = maze[r].offset;
    tiles = maze[r].tiles.slice(0);
    start = c - offset;
  } else {
    const res = getColumnTiles(maze, c);
    offset = res.offset;
    tiles = res.tiles;
    start = r - offset;
  }
  while (steps) {
    if (dir === "L" || dir === "U") {
      tiles.reverse();
      start = tiles.length - 1 - start;
    } // Need to convert back
    const wall = tiles.findIndex((val, idx) => val === "#" && idx > start);
    if (wall > -1) {
      if (wall - start > steps) {
        // Finish before wall
        stop = start + steps;
        steps = 0;
      } else {
        // Run into wall
        stop = wall - 1;
        steps = 0;
      }
    } else {
      if (tiles.length - 1 - start >= steps) {
        // Finish before end
        stop = start + steps;
        steps = 0;
      } else {
        steps -= tiles.length - 1 - start;
        stop = tiles.length - 1;
        // Move to another direction!!!
        // Change according to input
        let newR = r,
          newC = c;
        // For test data
        // if (dir === "R") {
        //   if ((r >= 0 && r < width) || (r >= width * 2 && r < width * 3)) {
        //     newR = width * 3 - 1 - r;
        //     newC = maze[newR].offset + maze[newR].tiles.length - 1;
        //     // Not moving into the new side
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "L";
        //     }
        //   } else if (r >= width && r < width * 2) {
        //     newR = width * 2;
        //     newC = width * 4 - 1 - (r - width);
        //     // Not moving into the new side
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "D";
        //     }
        //   }
        // } else if (dir === "L") {
        //   if (r >= 0 && r < width) {
        //     newR = width;
        //     newC = width + r;
        //     // Not moving into the new side
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "D";
        //     }
        //   } else if (r >= width && r < width * 2) {
        //     newR = width * 3 - 1;
        //     newC = width * 4 - 1 - (r - width);
        //     // Not moving into the new side
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "U";
        //     }
        //   } else if (r >= width * 2 && r < width * 3) {
        //     newR = width * 2 - 1;
        //     newC = width * 2 - 1 - (r - width * 2);
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "U";
        //     }
        //   }
        // } else if (dir === "D") {
        //   if (c >= 0 && c < width) {
        //     newR = width * 3 - 1;
        //     newC = width * 3 - 1 - c;
        //     // Not moving into the new side
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "U";
        //     }
        //   } else if (c >= width && c < width * 2) {
        //     newR = width * 2 + (width * 2 - 1 - c);
        //     newC = width * 2;
        //     // Not moving into the new side
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "R";
        //     }
        //   } else if (c >= width * 2 && c < width * 3) {
        //     newR = width * 2 - 1;
        //     newC = width * 3 - 1 - c;
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "U";
        //     }
        //   } else if (c >= width * 3 && c < width * 4) {
        //     newR = width + (width * 4 - 1 - c);
        //     newC = 0;
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "R";
        //     }
        //   }
        // } else if (dir === "U") {
        //   if (c >= 0 && c < width) {
        //     newR = 0;
        //     newC = width * 3 - 1 - c;
        //     // Not moving into the new side
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "D";
        //     }
        //   } else if (c >= width && c < width * 2) {
        //     newR = c - width;
        //     newC = width * 2;
        //     // Not moving into the new side
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "R";
        //     }
        //   } else if (c >= width * 2 && c < width * 3) {
        //     newR = width;
        //     newC = width * 3 - 1 - c;
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "D";
        //     }
        //   } else if (c >= width * 3 && c < width * 4) {
        //     newR = width + (width * 4 - 1 - c);
        //     newC = width * 3 - 1;
        //     if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
        //       steps = 0;
        //     } else {
        //       dir = "L";
        //     }
        //   }
        // }

        // For real data
        if (dir === "R") {
            if (r >= 0 && r < width) {
              newR = width * 3 - 1 - r;
              newC = width * 2 - 1;
              // Not moving into the new side
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "L";
              }
            } else if (r >= width && r < width * 2) {
              newR = width - 1;
              newC = width * 2 + (r - width);
              // Not moving into the new side
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "U";
              }
            } else if (r >= width * 2 && r < width * 3) {
              newR = width * 3 - 1 - r;
              newC = width * 3 - 1;
              // Not moving into the new side
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "L";
              }
            } else if (r >= width * 3 && r < width * 4) {
              newR = width * 3 - 1;
              newC = width + (r - width * 3);
              // Not moving into the new side
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "U";
              }
            }
          } else if (dir === "L") {
            if (r >= 0 && r < width) {
              newR = width * 3 - 1 - r;
              newC = 0;
              // Not moving into the new side
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "R"
              }
            } else if (r >= width && r < width * 2) {
              newR = width * 2;
              newC = r - width;
              // Not moving into the new side
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "D";
              }
            } else if (r >= width * 2 && r < width * 3) {
              newR = width * 3 - 1 - r;
              newC = width;
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "R";
              }
            } else if (r >= width * 3 && r < width * 4) {
              newR = 0;
              newC = r - width * 2;
              // Not moving into the new side
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "D";
              }
            }
          } else if (dir === "D") {
            if (c >= 0 && c < width) {
              newR = 0;
              newC = width * 2 + c;
              // Not moving into the new side
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "D";
              }
            } else if (c >= width && c < width * 2) {
              newR = width * 2 + c;
              newC = width - 1;
              // Not moving into the new side
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "L";
              }
            } else if (c >= width * 2 && c < width * 3) {
              newR = c - width;
              newC = width * 2 - 1;
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "L";
              }
            }
          } else if (dir === "U") {
            if (c >= 0 && c < width) {
              newR = width + c;
              newC = width;
              // Not moving into the new side
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "R";
              }
            } else if (c >= width && c < width * 2) {
              newR = c + width * 2;
              newC = 0;
              // Not moving into the new side
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "R";
              }
            } else if (c >= width * 2 && c < width * 3) {
              newR = width * 4 - 1;
              newC = c - width * 2;
              if (maze[newR].tiles[newC - maze[newR].offset] === "#") {
                steps = 0;
              } else {
                dir = "U";
              }
            }
          }

        if (steps) {
          r = newR;
          c = newC;
          stop = 0;
          steps -= 1;
          // Construct the current row or column
          if (dir === "R" || dir === "L") {
            offset = maze[r].offset;
            tiles = maze[r].tiles.slice(0);
            start = c - offset;
          } else {
            const res = getColumnTiles(maze, c);
            offset = res.offset;
            tiles = res.tiles;
            start = r - offset;
          }
        }
      }
    }
  }
  if (dir === "L" || dir === "U") {
    stop = tiles.length - 1 - stop;
  }
  if (dir === "R" || dir === "L") {
    c = stop + offset;
  } else {
    r = stop + offset;
  }

  return { r, c, dir };
};

const walkPath2 = (maze: RowOrColumn[], path: Move[]) => {
  let dir: Dir = "R";
  let r = 0;
  let c = maze[0].offset;
  for (const move of path) {
    
    if (move.turn) {
      dir = changeDir(dir, move.turn);
    }
    // console.log('>>> Movement', {...move, dir});
    const res = moveForward2(maze, r, c, dir, move.steps);
    // console.log(res);
    
    r = res.r;
    c = res.c;
    dir = res.dir;
  }
  return (
    (r + 1) * 1000 +
    (c + 1) * 4 +
    ["R", "D", "L", "U"].findIndex((val) => val === dir)
  );
};

export const solution = (data: string[]) => {
  const { maze, path } = parseData(data);

  const res1 = walkPath(maze, path);
  console.log(">>> Part 1:", res1);

  const res2 = walkPath2(maze, path);
  console.log('>>> Part 2:', res2);
  return [
    res1,
    res2,
  ];
};

const data = readByLine("./day22/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
