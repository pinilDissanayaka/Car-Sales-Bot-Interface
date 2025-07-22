import { ChatInterface } from '@/components/chat/ChatInterface'
import { useChat } from '@/hooks/useChat'
import './App.css'

function App() {
  const { messages, isTyping, connectionError, sendMessage } = useChat()

  return (
    <div className="h-screen w-screen overflow-hidden">
      <ChatInterface
        messages={messages}
        onSendMessage={sendMessage}
        isTyping={isTyping}
        connectionError={connectionError}
      />
    </div>
  )
}

export default App
