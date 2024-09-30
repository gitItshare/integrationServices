import express from 'express'
import bodyParser from 'body-parser'
import routes from "./src/routes/index.js"
import dotenv from "dotenv"
import path from 'path';
import  Client  from 'ssh2-sftp-client'
import Jwt from './src/services/jwt.js';
const app = express()
const port = 6800
dotenv.config()
let rootPath = process.env.rootPath
global.appRoot = path.resolve(rootPath)
// let sftp = new Client();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(routes);

app.get('/', async (req, res) => {
  res.send("helloWorld")
})

// app.get('/ftp', (req, res) => {
//   sftp.connect({
//     host: process.env.sshServer,
//     port: process.env.sshPort,
//     username: process.env.sshUser,
//     password: process.env.sshPass
//   }).then(() => {
//     return sftp.list('/home')
//   }).then(data => {
//     console.log(data, 'the data info');
//     sftp.get('/home/copy.txt', appRoot+'/copy.txt');

//   }).catch(err => {
//     console.log(err, 'catch error');
//   });
//   res.send('Hello World!')
// })
app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
