const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.json({
      message: "No token"
    })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, "secretkey")

    req.userId = decoded.userId

    next()
  } catch (error) {
    console.log(error)

    return res.json({
      message: "Token inválido"
    })
  }
}

module.exports = auth