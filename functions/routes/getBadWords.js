const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const getBadWords = express()
require('dotenv').config()

const {
  validateFirebaseIdToken,
  validateAmityIdToken
} = require('../authMiddleware')

getBadWords.use(validateAmityIdToken)

getBadWords.get('/', async (req, res) => {
  try {
    const badWords = process.env.BAD_WORDS
    res.send(badWords)
  } catch (error) {
    console.log(`msg : ${error}`)
    res.sendStatus(500)
  }
})

exports.getBadWords = builderFunction.onRequest(getBadWords)
