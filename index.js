import express from 'express'
const app = express()
const port = 3000
import bodyParser from 'body-parser'
import routes from "./src/routes/index.js"
import dotenv from "dotenv"
dotenv.config()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(routes);

app.get('/', (req, res) => {
  
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
