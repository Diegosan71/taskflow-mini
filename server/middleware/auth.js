const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    return res.json({
      message: "No token"
    })
  }

  try {
    const decoded = jwt.verify(token, "secretkey")

    req.userId = decoded.userId

    next()
  } catch (error) {
    res.json({
      message: "Token inválido"
    })
  }
}

module.exports = auth