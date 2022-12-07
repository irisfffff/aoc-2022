import { readByLine, sumArray, quickSortRecursive } from "../utils";

type Directory = { size: number; subDirs: string[]; parent?: string };

const parseData = (data: string[]) => {
  let currentDir = "/";
  const dirs: Record<string, Directory> = { "/": { subDirs: [], size: 0 } };
  for (let i = 0; i < data.length; ) {
    if (data[i][0] === "$") {
      const [command, loc] = data[i].slice(2).split(" ");
      switch (command) {
        case "cd":
          if (loc === "..") {
            currentDir = dirs[currentDir].parent ?? "/"; // Avoid type error
          } else if (loc === "/") {
            currentDir = "/";
          } else {
            currentDir = currentDir + "/" + loc;
          }
          i += 1;
          break;
        case "ls":
          i += 1;
          // Be aware of duplicated file names!!!
          while (i < data.length && data[i][0] !== "$") {
            if (data[i].startsWith("dir")) {
              const dir = currentDir + "/" + data[i].slice(4);
              dirs[currentDir].subDirs.push(dir);
              dirs[dir] = { subDirs: [], parent: currentDir, size: 0 };
            } else {
              const [size, file] = data[i].split(" ");
              dirs[currentDir].subDirs.push(currentDir + "/" + file);
              dirs[currentDir + "/" + file] = {
                subDirs: [],
                parent: currentDir,
                size: parseInt(size),
              };
            }
            i += 1;
          }
          break;
        default:
          break;
      }
    }
  }
  return dirs;
};

const calculateDirSizes = (dirs: Record<string, Directory>, curDir: string) => {
  const stack = dirs[curDir].subDirs.slice();
  while (stack.length) {
    dirs[curDir].size += calculateDirSizes(dirs, stack.pop() ?? "");
  }
  return dirs[curDir].size;
};

const findDirsAtMost = (dirs: Record<string, Directory>, atMost: number) => {
  return sumArray(
    Object.keys(dirs).map((dir) =>
      dirs[dir].subDirs.length && dirs[dir].size <= atMost ? dirs[dir].size : 0
    )
  );
};

const findSmallestToDelete = (
  dirs: Record<string, Directory>,
  toDelete: number
) => {
  const options: number[] = [];
  Object.keys(dirs).forEach((dir) => {
    if (dirs[dir].subDirs.length && dirs[dir].size >= toDelete) {
      options.push(dirs[dir].size);
    }
  });
  quickSortRecursive(options, 0, options.length - 1);
  return options[0];
};

export const solution = (data: string[]) => {
  const parsedData = parseData(data);
  calculateDirSizes(parsedData, "/");
  const res1 = findDirsAtMost(parsedData, 100000);
  console.log(">>> Part 1:", res1);

  const totalDistSpace = 70000000;
  const updateMin = 30000000;
  const available = totalDistSpace - parsedData["/"].size;
  const toDelete = updateMin - available;
  const res2 = findSmallestToDelete(parsedData, toDelete);
  console.log(">>> Part 2:", res2);
  return [res1, res2];
};

const data = readByLine("./day07/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
