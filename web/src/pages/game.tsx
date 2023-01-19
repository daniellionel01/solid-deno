import { createSignal } from "solid-js";

export default function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <section class="text-gray-700 p-8">
      <h1 class="text-2xl font-bold">Game</h1>
    </section>
  );
}
