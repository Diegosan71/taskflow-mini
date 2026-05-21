require("dotenv").config()
const User = require("./models/User")
const express = require("express")
const cors = require("cors")
const connectDB = require("./db")
const Task = require("./models/Task")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const auth = require("./middleware/auth")

const app = express()
connectDB()
app.use(cors({
  origin: "*"
}))
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    message: "Hola desde el backend"
  })
})

// CREAR tarea
app.post("/tasks", auth, async (req, res) => {
  const newTask = new Task({
    title: req.body.title,
    completed: false,
    userId: req.userId
  })

  await newTask.save()

  res.json(newTask)
})

// OBTENER tareas del usuario
app.get("/tasks", auth, async (req, res) => {
  const tasks = await Task.find({
    userId: req.userId
  })

  res.json(tasks)
})

// BORRAR tarea
app.delete("/tasks/:id", auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id)

  res.json({
    message: "Tarea eliminada"
  })
})

app.post("/register", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  const newUser = new User({
    email: req.body.email,
    password: hashedPassword
  })

  await newUser.save()

  res.json({
    message: "Usuario creado"
  })
})

app.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email
  })

  if (!user) {
    return res.json({
      message: "Usuario no encontrado"
    })
  }

  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  )

  if (!isPasswordCorrect) {
    return res.json({
      message: "Password incorrecta"
    })
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET
  )

  res.json({
    message: "Login exitoso",
    token: token
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Servidor corriendo")
})