import { readByLine } from "../utils";

interface Room {
  name: string;
  flowRate: number;
  connections: string[];
}

interface Status {
  opened: string[];
  cur1: string;
  cur2: string;
  maxRelease: number;
}

const parseData = (data: string[]) => {
  const reg =
    /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/;
  const map: Map<string, number> = new Map();
  const rooms: Room[] = data.map((line, i) => {
    let res = line.match(reg);
    if (!res) return { name: "", flowRate: 0, connections: [] };
    map.set(res[1] as string, i);
    return {
      name: res[1],
      flowRate: parseInt(res[2]),
      connections: res[3].split(", "),
    };
  });

  // const connections = new Array(data.length).fill(0).map(i => new Array(data.length).fill(0))

  return { rooms, map };
};

const dp = (
  rooms: Room[],
  map: Map<string, number>,
  isOpen: boolean[],
  timeLeft: number,
  released: number,
  cur: string,
  prev: string[] // Array of the nodes visited until the last opened one
) => {
  // No time or all is open
  if (timeLeft <= 0 || !isOpen.filter((i) => !i).length) {
    return released;
  }
  const roomIdx = map.get(cur) ?? 0;
  const room = rooms[roomIdx];
  const res: number[] = [];
  // Not open current one
  for (const name of room.connections) {
    // Do not go back to where we come from directly
    if (!prev.includes(name)) {
      res.push(
        dp(rooms, map, isOpen.slice(0), timeLeft - 1, released, name, [
          ...prev,
          cur,
        ])
      );
    }
  }
  // Open current one
  if (!isOpen[roomIdx]) {
    timeLeft--;
    released += timeLeft * room.flowRate;
    isOpen[roomIdx] = true;
    for (const name of room.connections) {
      res.push(
        dp(rooms, map, isOpen.slice(0), timeLeft - 1, released, name, [cur])
      );
    }
  }
  return Math.max(...res);
};

const isExperienced = (
  experienced: Map<string, number>[],
  opened: string[],
  timeLeft: number,
  cur1: string,
  cur2: string
) => {
  const s =
    [cur1, cur2].sort().join(",") + ";" + opened.slice(0).sort().join(",");
  return experienced[timeLeft].get(s);
};

const dp2 = ({
  rooms,
  map,
  opened,
  timeLeft,
  cur1,
  prev1,
  cur2,
  prev2,
  experienced,
}: {
  rooms: Room[];
  map: Map<string, number>;
  opened: string[];
  timeLeft: number;
  cur1: string;
  prev1: string[]; // Array of the nodes visited until the last opened one
  cur2: string;
  prev2: string[]; // Array of the nodes visited until the last opened one
  experienced: Map<string, number>[];
}) => {
  // No time or all is open
  if (timeLeft <= 0 || opened.length === rooms.length) {
    return 0;
  }

  const ans = isExperienced(experienced, opened, timeLeft, cur1, cur2);
  if (ans) {
    return ans;
  }

  const room1 = rooms[map.get(cur1) ?? 0];
  const room2 = rooms[map.get(cur2) ?? 0];
  const res: number[] = [0];

  // Both move
  for (const name1 of room1.connections) {
    // Do not go back to where we come from directly
    if (prev1.includes(name1)) {
      continue;
    }
    for (const name2 of room2.connections) {
      // Do not go back to where we come from directly
      if (prev2.includes(name2)) {
        continue;
      }
      const release = dp2({
        rooms,
        map,
        opened,
        timeLeft: timeLeft - 1,
        cur1: name1,
        prev1: [...prev1, cur1],
        cur2: name2,
        prev2: [...prev2, cur2],
        experienced,
      });
      res.push(release);
    }
  }

  // I open, elephant moves
  if (!opened.includes(cur1)) {
    const curRelease = room1.flowRate * (timeLeft - 1);
    for (const name2 of room2.connections) {
      if (prev2.includes(name2)) {
        continue;
      }
      const release =
        curRelease +
        dp2({
          rooms,
          map,
          opened: [...opened, cur1],
          timeLeft: timeLeft - 1,
          cur1,
          prev1: [],
          cur2: name2,
          prev2: [...prev2, cur2],
          experienced,
        });
      res.push(release);
    }
  }

  // Elephant opens, I move. If in the same room, I always open first
  if (!opened.includes(cur2) && cur1 !== cur2) {
    const curRelease = room2.flowRate * (timeLeft - 1);
    for (const name1 of room1.connections) {
      if (prev1.includes(name1)) {
        continue;
      }
      const release =
        curRelease +
        dp2({
          rooms,
          map,
          opened: [...opened, cur2],
          timeLeft: timeLeft - 1,
          cur1: name1,
          prev1: [...prev1, cur1],
          cur2,
          prev2: [],
          experienced,
        });
      res.push(release);
    }
  }

  // Both open
  if (!opened.includes(cur1) && !opened.includes(cur2) && cur1 !== cur2) {
    const curRelease =
      room1.flowRate * (timeLeft - 1) + room2.flowRate * (timeLeft - 1);
    const release =
      curRelease +
      dp2({
        rooms,
        map,
        opened: [...opened, cur1, cur2],
        timeLeft: timeLeft - 1,
        cur1,
        prev1: [],
        cur2,
        prev2: [],
        experienced,
      });
    res.push(release);
  }

  const maxRelease = Math.max(...res);

  const s =
    [cur1, cur2].sort().join(",") + ";" + opened.slice(0).sort().join(",");
  experienced[timeLeft].set(s, maxRelease);

  return maxRelease;
};

export const solution = (data: string[]) => {
  const { rooms, map } = parseData(data);

  // const res1 = dp(
  //   rooms,
  //   map,
  //   rooms.map(({ flowRate }) => !flowRate),
  //   30,
  //   0,
  //   "AA",
  //   []
  // );
  // console.log(">>> Part 1:", res1);

  // console.log(rooms, map);

  const timeLeft = 26;
  const experienced = new Array(timeLeft + 1).fill(0).map((i) => new Map());

  const res2 = dp2({
    rooms,
    map,
    opened: rooms.filter(({ flowRate }) => !flowRate).map(({ name }) => name),
    timeLeft,
    cur1: "AA",
    prev1: [],
    cur2: "AA",
    prev2: [],
    experienced,
  });

  console.log(">>> Part 2:", res2);
  return [
    // res1,
    res2,
  ];
};

const data = readByLine("./day16/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
