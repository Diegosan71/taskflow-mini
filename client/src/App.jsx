import { useEffect, useState } from "react"
import "./index.css"

function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")

  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")

  const token = localStorage.getItem("token")

  // REGISTER
  const register = async () => {
    const response = await fetch("https://taskflow-api-siov.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await response.json()

    setMessage(data.message)
  }

  // LOGIN
  const login = async () => {
    const response = await fetch("https://taskflow-api-siov.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await response.json()

    localStorage.setItem("token", data.token)

    setMessage(data.message)

    fetchTasks()
  }

  // OBTENER tareas
  const fetchTasks = async () => {
    const response = await fetch("https://taskflow-api-siov.onrender.com/tasks", {
      headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
}
    })

    const data = await response.json()

    console.log(JSON.stringify(data))

    if (Array.isArray(data)) {
      setTasks(data)
    }
  }

  // CREAR tarea
  const createTask = async () => {
    await fetch("https://taskflow-api-siov.onrender.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        title
      })
    })


    console.log("tarea creada")

    setTitle("")

    fetchTasks()
  }

  // BORRAR tarea
  const deleteTask = async (id) => {
    await fetch(`https://taskflow-api-siov.onrender.com/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })

    fetchTasks()
  }

  useEffect(() => {
    if (token) {
      fetchTasks()
    }
  }, [])

  return (
    <div className="container">
      <h1>TaskFlow Mini</h1>

      {!token && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />

          <button onClick={register}>
            Register
          </button>

          <button onClick={login}>
            Login
          </button>

          <p className="message">{message}</p>
        </>
      )}

      {token && (
        <>
          <h2>Mis tareas</h2>

          <input
            type="text"
            placeholder="Nueva tarea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button onClick={createTask}>
            Agregar
          </button>

          <hr />

          {tasks.length === 0 && (
            <p>No hay tareas todavía</p>
          )}

          {tasks.map((task) => (
            <div className="task" key={task._id}>
              <p>{task.title}</p>

              <button onClick={() => deleteTask(task._id)}>
                Borrar
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default App