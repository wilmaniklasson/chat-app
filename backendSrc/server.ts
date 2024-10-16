// Importera och konfigurera
import express, { Express } from 'express'
const app: Express = express()
const port: number = Number(process.env.PORT || 1224)


// Middleware
app.use('/', express.static('dist/'))
app.use('/', express.json())





// Starta servern
app.listen(port, () => {
	console.log(`Server is listening on port ${port}...`)
})
