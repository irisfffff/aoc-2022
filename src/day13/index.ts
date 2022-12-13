import { readByLine, sumArray } from "../utils";

interface Pair {
  left: any[];
  right: any[];
}

enum OrderResult {
  RightOrder,
  OutOfOrder,
  Same,
}

const parseData = (data: string[]) => {
  const pairs: Pair[] = [];
  for (let i = 0; i < data.length; i += 3) {
    const left = JSON.parse(data[i]);
    const right = JSON.parse(data[i + 1]);
    pairs.push({ left, right });
  }
  return pairs;
};

const isRightOrder = (pair: Pair): OrderResult => {
  for(let i = 0; ; i++) {
    if(i >= pair.left.length && i >= pair.right.length) {
      break
    }
    // If the left list runs out of items first
    if(i >= pair.left.length && i < pair.right.length) {
      return OrderResult.RightOrder
    } else if (i >= pair.right.length && i < pair.left.length) {
      return OrderResult.OutOfOrder
    }

    if(typeof pair.left[i] === 'number' && typeof pair.right[i] === 'number') {
      if(pair.left[i] < pair.right[i]) {
        return OrderResult.RightOrder
      } else if (pair.left[i] > pair.right[i]) {
        return OrderResult.OutOfOrder
      } else {
        continue
      }
    } 
    
    if(typeof pair.left[i] !== 'number' && typeof pair.right[i] !== 'number') {
      const res = isRightOrder({left: pair.left[i], right: pair.right[i]})
      if(res !== OrderResult.Same) {
        return res
      }
      continue
    }

    if(typeof pair.left[i] === 'number') {
      const res = isRightOrder({left: [pair.left[i]], right: pair.right[i]})
      if(res !== OrderResult.Same) {
        return res
      }
      continue
    } else if (typeof pair.right[i] === 'number') {
      const res = isRightOrder({left: pair.left[i], right: [pair.right[i]]})
      if(res !== OrderResult.Same) {
        return res
      }
      continue
    }
  }
  return OrderResult.Same;
};

const findRightOrderPairs = (pairs: Pair[]) => {
  const rightOrderIdxes: number[] = [];
  pairs.forEach((pair, idx) => {
    const res = isRightOrder(pair)
    if (res === OrderResult.RightOrder) {
      rightOrderIdxes.push(idx + 1);
    }
  });
  return sumArray(rightOrderIdxes);
};

const sortPackets = (pairs: Pair[]) => {
  const divider1 = [[2]]
  const divider2 = [[6]]
  const packets = pairs.flatMap((pair) => [pair.left, pair.right])
  packets.push(divider1, divider2)
  // Bubble sort
  for(let i = 0; i < packets.length; i++){
    // Last i elements are already in place 
    for(var j = 0; j < ( packets.length - i -1 ); j++){
       
      // Checking if the item at present iteration
      // is greater than the next iteration
      if(isRightOrder({left: packets[j], right: packets[j+1]}) === OrderResult.OutOfOrder){
        // If the condition is true then swap them
        const temp = packets[j]
        packets[j] = packets[j + 1]
        packets[j+1] = temp
      }
    }
  }
  
  const divider1Idx = packets.findIndex(packet => packet === divider1)
  const divider2Idx = packets.findIndex(packet => packet === divider2)
  return (divider1Idx + 1) * (divider2Idx + 1)
}

export const solution = (data: string[]) => {
  const pairs = parseData(data);

  const res1 = findRightOrderPairs(pairs);
  console.log(">>> Part 1:", res1);

  const res2 = sortPackets(pairs);
  console.log(">>> Part 2:", res2);
  return [
    res1,
    res2,
  ];
};

const data = readByLine("./day13/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
