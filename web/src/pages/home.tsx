import axios from "axios";
import {createSignal} from "solid-js";
import { createGameStore } from "../store.tsx";

export default function Home() {
  const [id, setId] = createSignal("88e2707d-db4a-4548-af57-4749eb0b05c1")
  const [gameState, setGameState] = createGameStore()

  const onJoin = async () => {
    const uuid = id()

    const res = await axios.get(`http://localhost:8080/game/${uuid}`)

    const isP1 = res.data.connectedP1 ? false : true

    setGameState({ serverGame: res.data.game, isP1 })
  }

  return (
    <section class="text-gray-700 p-8">
      <h1 class="text-2xl font-bold">Home</h1>

      <div class="mt-8">
        <input placeholder="Game ID" class="px-4 py-2 border-2 w-full max-w-md"
          value={id()}
          onInput={e => setId(e.currentTarget.value)}
        />

        <button class="bg-gray-300 py-2 px-4 ml-4 font-semibold" onClick={onJoin}>
          join
        </button>
      </div>
    </section>
  );
}
