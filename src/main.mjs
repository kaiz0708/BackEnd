import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config' 
import API from './Web/API.mjs'
import APIadmin from './Web/API_admin.mjs'
import RealTime from './socket/socket.mjs'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const { APIuser , APIauth } = API
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use( '/avatar' , express.static(path.join(__dirname, 'avatar')))
process.setMaxListeners(0)
const server = createServer(app)
const io = new Server(server , {cors: {
    origin: '*',
}}  )
APIuser(app);
APIadmin(app)
APIauth(app)
RealTime(io)
server.listen(3800)