import { Game, ServerGame } from "../../../packages/lib/src/index.ts";
import { createLocalStore } from "./utils.tsx";

export type GameData = {
  serverGame?: ServerGame,
  isP1?: boolean
}

export const createGameStore = () => createLocalStore<GameData>("game", {})
