import { readByLine, sumArray } from "../utils";

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

const parseData = (data: string[]) => {
  return data.map((i) => parseInt(i));
};

const mixEncryptedFile = (f: number[]) => {
  const length = f.length;
  const visited: boolean[] = new Array(length).fill(false);
  for (let i = 0; i < f.length; ) {
    // Already visited
    if (visited[i]) {
      i++;
      continue;
    }

    if (f[i] !== 0) {
      const val = f.splice(i, 1)[0];
      // Move forward or backwardf[i]
      visited.splice(i, 1);
      let ii = mod(i + val, length - 1);

      if (ii === 0) {
        ii = length - 1;
      }
      f.splice(ii, 0, val);
      visited.splice(ii, 0, true);

      if (ii <= i) {
        i++;
      }
    } else {
      // f[i] is 0, does not move
      visited[i] = true;
      i++;
    }
  }
};

const mixEncryptedFile2 = (f: number[], order: number[]) => {
  const length = f.length;
  for (let cur = 0; cur < f.length; cur++) {
    let i = order.findIndex(val => val === cur)
    if (f[i] !== 0) {
      const val = f.splice(i, 1)[0];
      // Move forward or backwardf[i]
      order.splice(i, 1);
      let ii = mod(i + val, length - 1);

      if (ii === 0) {
        ii = length - 1;
      }
      f.splice(ii, 0, val);
      order.splice(ii, 0, cur);
    }
  }
};

const getProduct = (f: number[]) => {
  const idx = f.findIndex((i) => i === 0);
  const inspect = [1000, 2000, 3000];
  const res = inspect.map((i) => {
    return f[mod(i + idx, f.length)];
  });
  return sumArray(res);
};

export const solution = (data: string[]) => {
  const original = parseData(data);
  const f = original.slice(0);
  // console.log(parsedData);

  // ** To be changed *
  mixEncryptedFile(f);
  const res1 = getProduct(f);
  console.log(">>> Part 1:", res1);

  // ** To be changed *
  const decryptionKey = 811589153;
  const order = original.map((val, i) => i)
  const ff = original.map((i) => i * decryptionKey);
  let times = 10;
  while (times) {
    mixEncryptedFile2(ff, order);
    times--;
  }
  const res2 = getProduct(ff);
  console.log(">>> Part 2:", res2);
  return [res1, res2];
};

const data = readByLine("./day20/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
