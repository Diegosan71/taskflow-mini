import { useEffect, useState } from "react"
import "./index.css"

const API = "https://taskflow-api-siov.onrender.com"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")

  const token = localStorage.getItem("token")

  // REGISTER
  const register = async () => {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()
    setMessage(data.message)
  }

  // LOGIN
  const login = async () => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok || !data.token) {
      setMessage(data.message || "Error login")
      return
    }

    localStorage.setItem("token", data.token)
    setMessage("Login correcto")
    fetchTasks()
  }

  // GET TASKS
  const fetchTasks = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = await res.json()

    if (Array.isArray(data)) {
      setTasks(data)
    } else {
      console.log("ERROR tasks:", data)
    }
  }

  // CREATE TASK
  const createTask = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    })

    const data = await res.json()

    if (!res.ok) {
      console.log(data.message)
      return
    }

    setTitle("")
    fetchTasks()
  }

  // DELETE TASK
  const deleteTask = async (id) => {
    const token = localStorage.getItem("token")

    await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    fetchTasks()
  }

  useEffect(() => {
    if (token) fetchTasks()
  }, [])

  return (
    <div className="container">
      <h1>TaskFlow Mini</h1>

      {!token ? (
        <>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>

          <p>{message}</p>
        </>
      ) : (
        <>
          <h2>Mis tareas</h2>

          <input
            placeholder="Nueva tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button onClick={createTask}>Agregar</button>

          {tasks.length === 0 && <p>No hay tareas</p>}

          {tasks.map((t) => (
            <div key={t._id} className="task">
              <p>{t.title}</p>
              <button onClick={() => deleteTask(t._id)}>Borrar</button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default App