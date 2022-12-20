import { readByLine } from "../utils";

type Connection = {
  to: string;
  dis: number;
};

interface Room {
  name: string;
  flowRate: number;
  tunnels: string[];
  connections: Connection[];
  fromStart: number;
}

interface Status {
  isOpen: boolean[];
  cur1: string;
  cur2: string;
  maxRelease: number;
}

const start = "AA";

const parseData = (data: string[]) => {
  const reg =
    /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/;
  const map: Map<string, number> = new Map();
  const rooms: Room[] = data.map((line, i) => {
    let res = line.match(reg);
    if (!res)
      return {
        name: "",
        flowRate: 0,
        tunnels: [],
        connections: [],
        fromStart: Infinity,
      };
    map.set(res[1] as string, i);
    return {
      name: res[1],
      flowRate: parseInt(res[2]),
      tunnels: res[3].split(", "),
      connections: [],
      fromStart: Infinity,
    };
  });

  return { rooms, map };
};

// Find shortest dis to all other valves
const bfs = (from: string, rooms: Room[], map: Map<string, number>) => {
  const idx = map.get(from) ?? 0;
  const roomFrom = rooms[idx];
  const visited = new Array(rooms.length).fill(false);
  visited[idx] = true;
  const q = [{ dis: 1, tunnels: roomFrom.tunnels }];
  while (q.length) {
    const cur = q.shift();
    if (!cur) break;
    const newTunnels = [];
    for (const to of cur.tunnels) {
      const toIdx = map.get(to) ?? 0;
      if (visited[toIdx]) continue;
      visited[toIdx] = true;
      if (to === start) {
        roomFrom.fromStart = cur.dis;
      }
      if (rooms[toIdx].flowRate) {
        roomFrom.connections.push({ to, dis: cur.dis });
      }
      for (const tunnel of rooms[toIdx].tunnels) {
        if (!visited[map.get(tunnel) ?? 0]) {
          newTunnels.push(tunnel);
        }
      }
    }
    if (newTunnels.length) {
      q.push({ dis: cur.dis + 1, tunnels: newTunnels });
    }
  }
};

const buildRoomtunnels = ({
  rooms,
  map,
}: {
  rooms: Room[];
  map: Map<string, number>;
}) => {
  for (const room of rooms) {
    if (room.flowRate) {
      bfs(room.name, rooms, map);
    }
  }
  const valveRooms = rooms.filter((room) => room.flowRate);
  const newMap = new Map();
  for (let i = 0; i < valveRooms.length; i++) {
    newMap.set(valveRooms[i].name, i);
  }
  return { rooms: valveRooms, map: newMap };
};

const dp = (
  room: Room,
  rooms: Room[],
  map: Map<string, number>,
  isOpen: boolean[],
  timeLeft: number
) => {
  // No time or all is open
  if (timeLeft <= 1 || !isOpen.filter((i) => !i).length) {
    return 0;
  }

  const release = (timeLeft - 1) * room.flowRate;
  // Open current one
  const res: number[] = [release];

  isOpen[map.get(room.name) as number] = true;
  // Pick the next one to move to
  for (const { to, dis } of room.connections) {
    const toIdx = map.get(to) as number;
    if (isOpen[toIdx]) continue;
    res.push(
      release +
        dp(rooms[toIdx], rooms, map, isOpen.slice(0), timeLeft - 1 - dis)
    );
  }

  return Math.max(...res);
};

const getMaxPressure = (rooms: Room[], map: Map<string, number>) => {
  const res = [];
  const time = 30;

  for (const room of rooms) {
    res.push(
      dp(
        room,
        rooms,
        map,
        new Array(rooms.length).fill(false),
        time - room.fromStart
      )
    );
  }

  return Math.max(...res);
};

const dp2 = (
  room1: Room,
  room2: Room,
  rooms: Room[],
  map: Map<string, number>,
  isOpen: boolean[],
  timeLeft: number,
  moveLeft1: number,
  moveLeft2: number
) => {
  // No time or all is open
  if (timeLeft <= 1 || !isOpen.filter((i) => !i).length) {
    return 0;
  }

  const open1 = moveLeft1 === 0;
  const open2 = moveLeft2 === 0;
  let release = 0,
    nextRoom1 = room1,
    nextRoom2 = room2;
  if (open1 && !isOpen[map.get(room1.name) as number]) {
    release += (timeLeft - 1) * room1.flowRate;
    isOpen[map.get(room1.name) as number] = true;
  }
  if (open2 && !isOpen[map.get(room2.name) as number]) {
    release += (timeLeft - 1) * room2.flowRate;
    isOpen[map.get(room2.name) as number] = true;
  }

  const res: number[] = [release];
  if (open1 && !open2) {
    for (const { to, dis } of room1.connections) {
      const toIdx = map.get(to) as number;
      if (isOpen[toIdx] || to === room2.name) continue;
      nextRoom1 = rooms[toIdx];
      const minInterval = Math.min(1 + dis, moveLeft2);
      res.push(
        release +
          dp2(
            nextRoom1,
            nextRoom2,
            rooms,
            map,
            isOpen.slice(0),
            timeLeft - minInterval,
            dis + 1 - minInterval,
            moveLeft2 - minInterval
          )
      );
    }
  } else if (open2 && !open1) {
    for (const { to, dis } of room2.connections) {
      const toIdx = map.get(to) as number;
      if (isOpen[toIdx] || to === room1.name) continue;
      nextRoom2 = rooms[toIdx];
      const minInterval = Math.min(1 + dis, moveLeft1);
      res.push(
        release +
          dp2(
            nextRoom1,
            nextRoom2,
            rooms,
            map,
            isOpen.slice(0),
            timeLeft - minInterval,
            moveLeft1 - minInterval,
            dis + 1 - minInterval
          )
      );
    }
  } else if (open1 && open2) {
    // Both move

    // Only one left to be open
    if (isOpen.filter((i) => !i).length === 1) {
      for (const { to: to1, dis: dis1 } of room1.connections) {
        const toIdx1 = map.get(to1) as number;
        if (isOpen[toIdx1] || to1 === room2.name) continue;
        nextRoom1 = rooms[toIdx1];
        res.push(
          release +
            dp2(
              nextRoom1,
              nextRoom2,
              rooms,
              map,
              isOpen.slice(0),
              timeLeft - 1 - dis1,
              0,
              0
            )
        );
      }
    } else {
      for (const { to: to1, dis: dis1 } of room1.connections) {
        const toIdx1 = map.get(to1) as number;
        if (isOpen[toIdx1]) continue;
        nextRoom1 = rooms[toIdx1];

        for (const { to: to2, dis: dis2 } of room2.connections) {
          const toIdx2 = map.get(to2) as number;
          if (isOpen[toIdx2] || to2 === to1) continue;
          nextRoom2 = rooms[toIdx2];

          const minInterval = Math.min(dis1, dis2)
          res.push(
            release +
              dp2(
                nextRoom1,
                nextRoom2,
                rooms,
                map,
                isOpen.slice(0),
                timeLeft - 1 - minInterval,
                dis1 - minInterval,
                dis2 - minInterval,
              )
          );
        }
      }
    }
  }
  return Math.max(...res);
};

const getMaxPressure2 = (rooms: Room[], map: Map<string, number>) => {
  const res = [];
  const time = 26;
  // Elephant and I start at a different position
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const room1 = rooms[i];
      const room2 = rooms[j];
      const minInterval = Math.min(room1.fromStart, room2.fromStart);
      res.push(
        dp2(
          room1,
          room2,
          rooms,
          map,
          new Array(rooms.length).fill(false),
          time - minInterval,
          room1.fromStart - minInterval,
          room2.fromStart - minInterval
        )
      );
    }
  }
  return Math.max(...res)
};

export const solution = (data: string[]) => {
  const { rooms, map } = buildRoomtunnels(parseData(data));
  // console.log(rooms, map);

  const res1 = getMaxPressure(rooms, map);
  console.log(">>> Part 1:", res1);

  const res2 = getMaxPressure2(rooms, map);
  // -2 with test data but correct with my data..
  console.log(">>> Part 2:", res2);
  return [
    res1,
    res2,
  ];
};

const data = readByLine("./day16/data");
// Do not run if empty file or test mock readFileSync
if (data[0]) {
  solution(data);
}
