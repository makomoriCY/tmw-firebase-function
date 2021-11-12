const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const checkWebhook = express()

checkWebhook.post('/', async (req, res) => {
  try {
    console.log('body', req.body)
    res.send(JSON.stringify(req.body))
  } catch (error) {
    console.log(`msg : ${error}`)
    res.sendStatus(500)
  }
})

exports.checkWebhook = builderFunction.onRequest(checkWebhook)
