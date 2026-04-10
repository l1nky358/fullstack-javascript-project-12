import { useEffect, useState } from 'react'
import { initSocket, closeSocket, getSocket } from '../socket'

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const socket = initSocket(token)

    const onConnect = () => {
      console.log('✅ WebSocket connected')
      setIsConnected(true)
    }

    const onDisconnect = () => {
      console.log('❌ WebSocket disconnected')
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    if (socket.connected) {
      setIsConnected(true)
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      closeSocket()
    }
  }, [])

  return { socket: getSocket(), isConnected }
}
