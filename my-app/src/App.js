import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'
import { getTestMessage } from './api'

function App() {
  const [message, setTestMessage] = useState('')

  useEffect(() => {
    const fetchTestMessage = async () => {
      const data = await getTestMessage()
      setTestMessage(data || 'No message received')
    }
    fetchTestMessage()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>LifeFlow Frontend</h1>
        <p>
          {message || 'Loading message from backend...'}
        </p>
      </header>
    </div>
  );
}

export default App;
