import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { api } from '../services/api'

export const useSocketEvents = (socket) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (!socket) return

    // Обработчики событий согласно документации
    const handleNewChannel = (payload) => {
      console.log('🆕 New channel:', payload)
      dispatch(api.util.invalidateTags(['Channels']))
    }

    const handleRenameChannel = (payload) => {
      console.log('✏️ Channel renamed:', payload)
      dispatch(api.util.invalidateTags(['Channels']))
    }

    const handleRemoveChannel = (payload) => {
      console.log('❌ Channel removed:', payload)
      dispatch(api.util.invalidateTags(['Channels']))
    }

    const handleNewMessage = (payload) => {
      console.log('💬 New message:', payload)
      dispatch(api.util.invalidateTags(['Messages']))
    }

    // Подписываемся
    socket.on('newChannel', handleNewChannel)
    socket.on('renameChannel', handleRenameChannel)
    socket.on('removeChannel', handleRemoveChannel)
    socket.on('newMessage', handleNewMessage)

    return () => {
      socket.off('newChannel', handleNewChannel)
      socket.off('renameChannel', handleRenameChannel)
      socket.off('removeChannel', handleRemoveChannel)
      socket.off('newMessage', handleNewMessage)
    }
  }, [socket, dispatch])
}
