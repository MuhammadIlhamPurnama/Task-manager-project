const express = require('express')
const router = require('./routes')
const cors  = require('cors')
const errorHandler = require('./middlewares/errorHandler')
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use('/api', router)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app