const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')

const firebase = require('../db')
const firestore = firebase.firestore()

const updateTransaction = express()

updateTransaction.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const data = req.body
    const transactionId = await firestore.collection('transaction').doc(id)
    await transactionId.update(data)
    res.send('transaction updated successfuly')
  } catch (error) {
    res.status(400).send(error.message)
  }
})

exports.updateTransaction = builderFunction.onRequest(updateTransaction)
