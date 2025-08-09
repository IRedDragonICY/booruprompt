import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { invoke } from '@tauri-apps/api/core'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('Tauri')
  const [message, setMessage] = useState('')

  async function handleGreet() {
    try {
      const result = await invoke<string>('greet', { name })
      setMessage(result)
    } catch (err) {
      setMessage(String(err))
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Tauri</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="card" style={{ display: 'grid', gap: 8 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" />
        <button onClick={handleGreet}>Greet dari Rust</button>
        {message && <pre>{message}</pre>}
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
