const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')

const firebase = require('../db')
const Transaction = require('../models/transaction')
const firestore = firebase.firestore()

const versionFireStore = express()

// versionFireStore.post('/', async (req, res) => {
//   try {
//     const data = req.body
//     await firestore
//       .collection('transaction')
//       .doc()
//       .set(data)
//     res.send('Record saved successfuly')
//   } catch (error) {
//       console.log(`msg : ${error} `)
//     // res.status(400).send(error.message)
//   }
// })

// versionFireStore.get('/:id', async (req, res) => {
//   try {
//     const id = req.params.id
//     const transactionId = await firestore.collection('transaction').doc(id)
//     const data = await transactionId.get()
//     if (!data.exists) {
//       res.status(404).send('transaction  not found')
//     } else {
//       res.send(data.data())
//     }
//   } catch (error) {
//     console.log(`msg : ${error} `)
//   }
// })

versionFireStore.put('/:id', async (req, res) => {
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

exports.versionFireStore = builderFunction.onRequest(versionFireStore)
