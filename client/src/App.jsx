import io from "socket.io-client";
import {useState, useEffect} from 'react'

//Conexion al back-end (vite.config.js)
const socket = io('/');

function App() {  

  const [message, setMessage] = useState(""); 
  const [messages, setMessages] = useState([]);
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const newMessage = {
      body: message,
      from: 'Me'
    }

    setMessages([...messages, newMessage]);
    socket.emit('message', message); //Envia el msj del front al back
  } 

  //Envia el msj a todos los clientes excepto él mismo(emisor)
  useEffect(() => {
    socket.on('message', receiveMessage); 

    return () => {
    socket.off('message', receiveMessage); 
    };
  }, []);

  const receiveMessage = (message) => 
    setMessages((state) => [...state, message]
  );

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2">Chat React with Socket.io</h1>
        <input type='text' placeholder='Write your message' onChange={(e) => setMessage(e.target.value)} className="border-2 border-zinc-500 p-2 w-full text-black"></input>
      <ul>
        {
          messages.map((message, i) => (
            <li key={i} className={
            `my-2 p-2 table text-sm rounded-sm ${message.from === 'Me' ? 
              'bg-sky-700': `bg-red-700 ml-auto`}`
            }>
              <span className="text-xs text-slate-300 block">{message.from}</span>
              <span className="text-md">{message.body}</span>  
            </li>
          ))
        }
      </ul>
      </form>
    </div> 
  );
}

export default App