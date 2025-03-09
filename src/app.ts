import express from 'express'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import ApiController from './api/ApiController.js'
import { DatabaseOptions, Environment } from './internal/EnvironmentConfig.js'
import DeepLinkRouter from './routes/DeepLinkRouter.js'
import JobManager from './jobs/JobManager.js'

const app = express()
const port = 8080
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const webappDir = '../frontend/build'
const templatesDir = '../frontend/templates'
const jobManager = new JobManager()

/*
* Cron job setup and management
 */
jobManager.initializeJobs()

/*
* Handling API requests
 */
app.use('/api', ApiController)

/*
* Returning static HTML pages
 */
app.use(express.static(join(__dirname, templatesDir)))
app.get('/', (_, res) => {
  res.sendFile(join(__dirname, `${templatesDir}/homepage.html`))
})

/*
* Hosting assets related to web usage
 */
app.use('/favicon.ico', express.static('images/favicon.ico'))
app.use('/.well-known', DeepLinkRouter)

/*
* Returning a built React app
 */
app.use(express.static(join(__dirname, webappDir)))
app.get('/*', (_, res) => {
  res.sendFile(join(__dirname, `${webappDir}/index.html`))
})

console.log(`ENV: ${Environment.getEnv()}`)

/*
* Connect your MongoDB database here
* All API requests require database to be setup
 */
// mongoose
//   .connect(Environment.getDatabaseUrl(), DatabaseOptions)
//   .then(() => console.log(`Connected to MongoDB`))
//
// mongoose.connection
//   .on('error', console.error.bind(console, 'Error connecting to MongoDB'))

app.listen(port, () => {
  return console.log(`NodeSchedular listening at http://localhost:${port}`)
})