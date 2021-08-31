const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')

const firebase = require('../db')
const firestore = firebase.firestore()

const createTransaction = express()

createTransaction.post('/', async (req, res) => {
  try {
    const data = req.body
    await firestore
      .collection('transaction')
      .doc()
      .set({
        transferId: data.transferId,
        messageId: data.messageId,
        amt: data.amt,
        currency: data.currency,
        timestamp: new Date().toString(),
        sender: data.sender,
        receiver: data.receiver
      })
    res.send('Record saved successfuly')
  } catch (error) {
    console.log(`msg : ${error} `)
  }
})

exports.createTransaction = builderFunction.onRequest(createTransaction)
