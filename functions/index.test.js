const express = require('express')
const app = express()
const cors = require('cors')
const createChatRoutes = require('./routes/createChatRoom')
const notificationRoutes = require('./routes/sendNotification')
const updateMessageRoutes = require('./routes/updateMessageStatus')
const transferMoneyRoutes = require('./routes/transferMoneySuccess')
const getBadWordsRoutes = require('./routes/getBadWords')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TMW',
      version: '1.0.0',
      description: 'TMW API'
    },
    servers: [
      {
        url: 'http://localhost:5001'
      }
    ]
  },
  apis: ['./routes/*.js']
}

const specs = swaggerJsDoc(options)

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))

// const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/createChatRoom', createChatRoutes)
// app.use('/sendMessageNotification', notificationRoutes)
// app.use('/updateMessageStatus', updateMessageRoutes)
// app.use('/transferMoneySuccess', transferMoneyRoutes)
// app.use('/getBadWords', getBadWordsRoutes)

// app.listen(PORT, () => console.log(`The server is running on port ${PORT}`))

const functions = require("firebase-functions");


exports.helloWorld = functions.https.onRequest(app)
