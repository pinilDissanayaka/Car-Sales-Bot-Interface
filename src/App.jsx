import { ChatInterface } from '@/components/chat/ChatInterface'
import { Header } from '@/components/layout/Header'
import { useChat } from '@/hooks/useChat'
import './App.css'

function App() {
  const { messages, isTyping, connectionError, sendMessage } = useChat()

  return (
    <div className="dark min-h-screen bg-black">
      <div className="h-screen w-screen overflow-hidden bg-black text-gray-100">
        <Header />
        <ChatInterface
          messages={messages}
          onSendMessage={sendMessage}
          isTyping={isTyping}
          connectionError={connectionError}
        />
      </div>
    </div>
  )
}

export default App
