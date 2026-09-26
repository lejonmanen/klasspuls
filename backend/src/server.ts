import express from 'express'
import apiRouter from './routes/api.ts'
import { logger } from './middleware.ts'

// console.log(`BUILD 1`)

const app = express()
const port = 3005


app.use(express.json())
app.use('/', logger)

app.get('/', (req, res) => {
	res.send('test get /')
})

app.use('/api', apiRouter)




app.listen(port, () => {
	console.log(`Server is listening on port ${port}.`)
})

