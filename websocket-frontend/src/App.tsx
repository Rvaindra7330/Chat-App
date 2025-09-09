import { useEffect, useRef, useState } from 'react';
import './App.css';
import { BACKEND_URL } from './config';

function App() {
  const [messages,setMessages]=useState([])
  const [input, setInput] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

 const wsRef = useRef<WebSocket | null>(null);
  useEffect(()=>{
    const ws = new WebSocket(BACKEND_URL);
    ws.onmessage=(event)=>{
      //@ts-ignore
      setMessages(m=>[...m, event.data])
    }
    wsRef.current = ws;
    ws.onopen=()=>{
      
    }
    return ()=>{
      ws.close()
    }
  },[])

    const joinRoom = () => {
    if (roomId.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'join', payload: { roomId } }));
      setIsJoined(true);
    }
  };
  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {!isJoined ? (<div className="flex flex-col items-center justify-center flex-1 space-y-4">
          <input
            className="px-4 py-2 rounded-full bg-white outline-none"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-800"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>)
      :(<div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(message => <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-blue-500 text-white rounded-full pt-3 max-w-fit"> 
          {message}
          </div>)}
           <div ref={messagesEndRef} />
      </div>
          <form className="bg-gray-800 p-4 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-purple-500 text-white rounded-full px-5 py-2 hover:bg-purple-800"
          onClick={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            wsRef.current?.send(JSON.stringify(
              {
              type:"chat",
              payload:{
                message:input
              }
            }
            ))
            setInput('');
          }}
        >
          Send
        </button>
      </form>
    
    </div>)}
    </div>
    
  );
}

export default App;
