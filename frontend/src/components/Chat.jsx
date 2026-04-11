import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useGetChannelsQuery, useGetMessagesQuery } from '../services/api'
import { setCurrentChannel } from '../store/channelsSlice'
import MessageForm from './MessageForm'
import ChannelsList from './ChannelsList'

const Chat = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [localMessages, setLocalMessages] = useState([])

  const { data: channels = [], isLoading: channelsLoading, refetch: refetchChannels } = useGetChannelsQuery()
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useGetMessagesQuery()

  const currentChannelId = useSelector(state => state.channels.currentChannelId)

  const defaultChannels = [
    { id: 1, name: 'general', removable: false },
    { id: 2, name: 'random', removable: true },
  ]

  const displayChannels = channels.length > 0
    ? channels
    : defaultChannels

  useEffect(() => {
    if (messages && messages.length) setLocalMessages(messages)
  }, [messages])

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentChannelId) refetchMessages()
    }, 2000)
    return () => clearInterval(interval)
  }, [currentChannelId, refetchMessages])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
  }, [navigate])

  useEffect(() => {
    if (!channelsLoading && displayChannels.length > 0 && !currentChannelId) {
      const generalChannel = displayChannels.find(ch => ch.name === 'general')
      dispatch(setCurrentChannel(generalChannel?.id || displayChannels[0].id))
    }
  }, [channelsLoading, displayChannels, currentChannelId, dispatch])

  useEffect(() => {
    if (currentChannelId) refetchMessages()
  }, [currentChannelId, refetchMessages])

  const addOptimisticMessage = (text, username) => {
    const tempMessage = {
      id: Date.now(),
      body: text,
      channelId: currentChannelId,
      username: username,
      createdAt: new Date().toISOString(),
    }
    setLocalMessages(prev => [...prev, tempMessage])
    setTimeout(() => refetchMessages(), 500)
  }

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    )
  }

  const currentChannel = displayChannels.find(c => c.id === currentChannelId)
  const channelMessages = localMessages.filter(m => m.channelId === currentChannelId)

  return (
    <div className="container-fluid h-100 overflow-hidden p-0">
      <div className="row h-100 g-0">
        <ChannelsList
          channels={displayChannels}
          currentChannelId={currentChannelId}
          onChannelChange={refetchChannels}
        />
        <div className="col-9 col-md-10 d-flex flex-column h-100">
          {currentChannel
            ? (
                <>
                  <div className="bg-light p-3 border-bottom">
                    <h5 className="mb-0">
                      {currentChannel.name === 'general'
                        ? 'general'
                        : `# ${currentChannel.name}`}
                    </h5>
                  </div>
                  <div className="flex-grow-1 overflow-auto p-3">
                    {channelMessages.length === 0
                      ? (
                          <div className="text-center text-muted">
                            Нет сообщений. Напишите первое!
                          </div>
                        )
                      : (
                          channelMessages.map(msg => (
                            <div key={msg.id} className="mb-2">
                              <strong className="text-primary me-2">
                                {msg.username}
                              </strong>
                              :
                              <span>{msg.body}</span>
                            </div>
                          ))
                        )}
                  </div>
                  <MessageForm
                    currentChannelId={currentChannelId}
                    onMessageSent={addOptimisticMessage}
                  />
                </>
              )
            : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center text-muted">
                    <h4>Добро пожаловать!</h4>
                    <p>Выберите канал из списка слева</p>
                  </div>
                </div>
              )}
        </div>
      </div>
    </div>
  )
}

export default Chat
