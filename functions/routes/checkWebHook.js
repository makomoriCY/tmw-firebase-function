const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const checkWebHook = express()

checkWebHook.post('/', async (req, res) => {
  try {
    console.log('body', req.body)
    console.log('msg', req.body.data?.messages[0])
    console.log('user', req.body.data?.users[0])
    console.log('meta data', req.body.data?.users[0]?.metadata)
    res.send(req.body)
  } catch (error) {
    console.log(`msg : ${error}`)
    res.sendStatus(500)
  }
})

exports.checkWebHook = builderFunction.onRequest(checkWebHook)
