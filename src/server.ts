import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import routes from './routes'
import './database/connection'

import errorHandler from './errors/handler'

const app = express()

app.use(cors())
app.use(express.json())
app.use(errorHandler)
app.use(routes)

app.listen(3001)
