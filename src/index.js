import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import Route from './route'
import cors from 'cors'
import path from 'path'
import fs from 'fs'

const app = express()
const server = require('http').Server(app)

// ---- menggunakan https ----
// const server = require('https').createServer({
//     key: fs.readFileSync(path.join(__dirname, '../cert', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, '../cert', 'cert.pem'))
// },app)
const io = require('socket.io')(server)
global.io = io

const port = 5000

// izinkan Cors
app.use(cors()) 
// "cors" biar dapat melakukan post data dari front end
app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept')
    next();
})

// set bodyParser sebagai middleware yang akan memparsing body request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

// connect ke database
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/server-aloptama', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

// set route
app.use('/api', Route)
app.use(express.static(path.join(__dirname, '../public'))) //ex : http://localhost:5000/uploads/photos-1615307076707.jpeg
app.get('/', (request, response) => {
    return response.end('Api Working')
})

server.listen(port, () => {
    console.log(`berjalan di port ${port}`)
})