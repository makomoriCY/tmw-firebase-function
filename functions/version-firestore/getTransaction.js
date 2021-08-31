const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')

const firebase = require('../db')
const firestore = firebase.firestore()

const getTransaction = express()

getTransaction.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const transactionId = await firestore.collection('transaction').doc(id)
    const data = await transactionId.get()
    if (!data.exists) {
      res.status(404).send('transaction  not found')
    } else {
      res.send(data.data())
    }
  } catch (error) {
    console.log(`msg : ${error} `)
  }
})

exports.getTransaction = builderFunction.onRequest(getTransaction)
