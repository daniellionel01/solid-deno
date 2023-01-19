import { Application, helpers, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts"
import { ServerGame, initGame } from "@lib"

const games: ServerGame[] = [
  {
    game: {
      ...initGame(),
      uuid: "88e2707d-db4a-4548-af57-4749eb0b05c1"
    },
    connectedP1: false,
    connectedP2: false,
  }
]

// === ROUTER
const router = new Router()

router.get("/game/:uuid", (ctx) => {
  const { uuid } = helpers.getQuery(ctx, { mergeParams: true })
  const game = games.find(g => g.game.uuid === uuid)
  ctx.response.type = "json"
  ctx.response.body = { game }
})
router.post("/game", (ctx) => {
  const game = { game: initGame(), connectedP1: false, connectedP2: false }
  games.push(game)
  ctx.response.type = "json"
  ctx.response.body = { game }
})

// === WEB SOCKET
const connectedClients = new Map();

function broadcast(message: string) {
  for (const client of connectedClients.values()) {
    client.send(JSON.stringify(message));
  }
}

router.get("/socket", (ctx) => {
  const socket = ctx.upgrade()
  const uuid = ctx.request.url.searchParams.get("uuid")
  if (connectedClients.has(uuid)) {
    socket.close(1008, `uuid ${uuid} is already taken`)
    return
  }

  connectedClients.set(uuid, socket)
  console.log(`New client connected: ${uuid}`)

  socket.onopen = () => {
    broadcast("Welcome!")
  }

  socket.onclose = () => {
    console.log(`Client ${uuid} disconnected`)
    connectedClients.delete(uuid)
  }

  socket.onmessage = (m) => {
    const data = JSON.parse(m.data)
    console.log(`Received message: ${data}`)
  }
})

// === APPLICATION

const app = new Application()

app.use(oakCors())
app.use(router.routes())
app.use(router.allowedMethods())

console.log("Listening at http://localhost:8080")
await app.listen({ port: 8080 })
