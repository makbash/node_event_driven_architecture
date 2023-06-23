import uniqid from 'uniqid'
import { Server, Socket } from 'socket.io'

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
    JOIN_ROOM: 'JOIN_ROOM',
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: 'ROOM_MESSAGE',
  },
}

// const rooms: Record<string, { roomId: string, roomName: string }> = {}
const rooms: { roomId: string, roomName: string, socketId: string }[] = []

export default ({ io }: { io: Server }) => {
  console.info('Sockets enabled')

  io.on(EVENTS.connection, (socket: Socket) => {
    console.info(`User connected ${socket.id}`)

    socket.emit(EVENTS.SERVER.ROOMS, rooms)

    // When a user creates a new room
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      console.log({ roomName })
      // create a roomId
      const roomId = uniqid()
      // add a new room to the rooms object
      rooms.push({ roomId, roomName, socketId: socket.id })

      socket.join(roomId)

      // broadcast an event saying there is a new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms)

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms)
      // emit event back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId)
    })

    //  When a user sends a room message
    socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({
      id, text, roomId, userName, socketId,
    }) => {
      const date = new Date()

      socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
        id,
        text,
        userName,
        socketId,
        time: `${date.getHours()}:${date.getMinutes()}`,
      })
    })

    // When a user joins a room
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId)

      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId)
    })
  })
}
