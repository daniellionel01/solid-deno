import { Component, onMount, createSignal, onCleanup } from "solid-js";
import { A, useRoutes } from "@solidjs/router";

import axios from "axios"
import { createGameStore } from "./store.tsx";
import { routes } from "./routes.ts";

const App: Component = () => {
  const Route = useRoutes(routes);

  const [gameState, setGameState] = createGameStore()

  onMount(async () => {
    if (!gameState.serverGame) return

    const res = await axios.get(`http://localhost:8080/game/${gameState.serverGame.game.uuid}`)
    console.log("Res", res.data)
    setGameState({ serverGame: res.data.game })
  })

  const [socket, setSocket] = createSignal<WebSocket | null>(null)
  const uuid = crypto.randomUUID()
  onMount(() => {
    const s = new WebSocket(`ws://localhost:8080/socket?uuid=${uuid}`)
    setSocket(s)

    s.onmessage = (m: MessageEvent) => {
      const data = JSON.parse(m.data);
      console.log("Received message", data)
    };
  })

  onCleanup(() => {
    socket()?.close()
  })

  return (
    <>
      <nav class="bg-gray-200 text-gray-900 px-4">
        <ul class="flex items-center">
          <li class="py-2 px-4">
            <A href="/" class="no-underline hover:underline">
              Home
            </A>
          </li>
          <li class="py-2 px-4">
            <A href="/game" class="no-underline hover:underline">
              Game
            </A>
          </li>
        </ul>
      </nav>

      <main>
        <Route />
      </main>
    </>
  );
};

export default App;
