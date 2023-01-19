
export const WIDTH = 10
export const HEIGHT = 10

export enum Orientation {
  VERT, HOR
}

export type Position = {
  x: number;
  y: number;
}

export type Ship = {
  ori: Orientation;
  length: number;
  pos: Position
}

export type Player = {
  ships: Ship[];
  shots: Position[]
}

export type Game = {
  uuid: string;
  turn: number;
  player1: Player;
  player2: Player;
}

export type ServerGame = {
  game: Game;
  connectedP1: boolean;
  connectedP2: boolean;
}

export function isTurnP1(game: Game): boolean {
  return game.turn % 2 === 0;
}
export function isTurnP2(game: Game): boolean {
  return game.turn % 2 !== 0;
}

export function getShipPositions(ship: Ship): Position[] {
  const result: Position[] = []
  for (let i = 0; i < ship.length; i++) {
    const x = ship.ori === Orientation.HOR
      ? ship.pos.x + i : ship.pos.x

    const y = ship.ori === Orientation.VERT
      ? ship.pos.y + i : ship.pos.y

    result.push({ x, y })
  }
  return result
}

export function posEq(pos1: Position, pos2: Position): boolean {
  return pos1.x === pos2.x && pos1.y === pos2.y
}

export function getShip(at: Position, ships: Ship[]): Ship | null {
  for (let ship of ships) {
    const positions = getShipPositions(ship)
    const eq = positions.find(pos => posEq(pos, at))
    if (eq) {
      return ship
    }
  }
  return null
}

export function isSunk(ship: Ship, shots: Position[]): boolean {
  const positions = getShipPositions(ship)
  for (const pos of positions) {
    const hit = shots.find(shot => posEq(shot, pos))
    if (!hit) return false
  }
  return true
}

export function isReadyP1(game: Game): boolean {
  return game.turn >= 0 || game.turn == -2
}
export function isReadyP2(game: Game): boolean {
  return game.turn >= 0 || game.turn == -1
}

export function isReady(game: Game): boolean {
  return game.turn >= 0
}

export function readyP1(game: Game): Game {
  return {
    ...game,
    turn: game.turn + 1
  }
}
export function readyP2(game: Game): Game {
  return {
    ...game,
    turn: game.turn + 2
  }
}

export function lostP1(game: Game): boolean {
  for (const ship of game.player1.ships) {
    const sunken = isSunk(ship, game.player2.shots)
    if (!sunken) return false
  }
  return true
}
export function lostP2(game: Game): boolean {
  for (const ship of game.player2.ships) {
    const sunken = isSunk(ship, game.player1.shots)
    if (!sunken) return false
  }
  return true
}

export function wonP1(game: Game): boolean {
  return lostP2(game)
}
export function wonP2(game: Game): boolean {
  return lostP1(game)
}

export function initGame(): Game {
  /*
   * _ 0 1 2 3 4 5 6 7 8 9
   * 0       X     X
   * 1             X
   * 2 X           X
   * 3 X               X
   * 4                 X
   * 5   X X       X
   * 6                   X
   * 7 X X X X       X   X
   * 8           X       X
   * 9
   */
  const ship = createShip(3, 1, 2, Orientation.VERT)
  const ships: Ship[] = [
    { ori: Orientation.HOR, length: 1, pos: { x: 3, y: 0 } },
    { ori: Orientation.HOR, length: 1, pos: { x: 6, y: 5 } },
    { ori: Orientation.HOR, length: 1, pos: { x: 5, y: 8 } },
    { ori: Orientation.HOR, length: 1, pos: { x: 7, y: 7 } },

    { ori: Orientation.VERT, length: 2, pos: { x: 0, y: 2 } },
    { ori: Orientation.VERT, length: 2, pos: { x: 8, y: 3 } },
    { ori: Orientation.HOR, length: 2, pos: { x: 1, y: 5 } },

    { ori: Orientation.VERT, length: 3, pos: { x: 6, y: 0 } },
    { ori: Orientation.VERT, length: 3, pos: { x: 9, y: 6 } },

    { ori: Orientation.HOR, length: 4, pos: { x: 0, y: 7 } },
  ]
  return {
    uuid: crypto.randomUUID(),
    turn: -3,
    player1: {
      ships,
      shots: []
    },
    player2: {
      ships,
      shots: []
    }
  }
}

export function createShot(x: number, y: number): Position {
  return { x, y }
}
export function createShip(x: number, y: number, length: number, ori: Orientation): Ship {
  return { pos: { x, y }, ori, length }
}

export function isValidPosition(ship: Ship, ships: Ship[], at: Position, ori?: Orientation): boolean {
  const invalidPositions: Position[] = []
  ships.forEach(sh => {
    if (sh.pos.x === ship.pos.x && sh.pos.y === ship.pos.y) return;
    const width = sh.ori === Orientation.HOR ? sh.length : 1
    const height = sh.ori === Orientation.VERT ? sh.length : 1
    const origX = sh.pos.x - 1
    const origY = sh.pos.y - 1
    for (let x = origX; x < origX+width+2; x++) {
      for (let y = origY; y < origY+height+2; y++) {
        invalidPositions.push({ x, y })
      }
    }
  })

  let invalid = false
  const newShip = { ...ship, pos: at }
  if (ori !== undefined) newShip.ori = ori
  getShipPositions(newShip).forEach(pos => {
    if (invalid) return;
    invalid = !!invalidPositions.find(inv => posEq(pos, inv))
  })

  const width = newShip.ori === Orientation.HOR ? newShip.length : 1
  const height = newShip.ori === Orientation.VERT ? newShip.length : 1
  if (at.x < 0 || at.y < 0 || at.x > WIDTH - width || at.y > HEIGHT - height) {
    invalid = true
  }

  return !invalid
}
