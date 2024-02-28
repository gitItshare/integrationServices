import express from 'express'
import bodyParser from 'body-parser'
import routes from "./src/routes/index.js"
import dotenv from "dotenv"
import path from 'path';
import estrategiaServices from "./src/services/estrategia/index.js";

const app = express()
const port = 3000
dotenv.config()
let rootPath = process.env.rootPath
global.appRoot = path.resolve(rootPath)


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(routes);

app.get('/', (req, res) => {
  
  res.send('Hello World!')
})
app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
