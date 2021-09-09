const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const axios = require('axios')

const firebase = require('../db')
const firestore = firebase.firestore()

const transferMoneySuccess = express()

transferMoneySuccess.post('/', async (req, res) => {
  try {
    const transferRef = req.body.transferRef
    
    const transaction = await getDataFromTransaction(transferRef)

    const { messageId, sender, receiver, amt, currency } = transaction

    const updateMessage = await updateMessageStatus(messageId)

    if (updateMessage.metadata.status !== 'paid')
      return res
        .status(404)
        .send(
          'Request failed: could not send notification with status code 404'
        )
      
    const createSlip = {
      amount: amt,
      currency: currency,
      sender: sender,
      receiver: receiver,
      time: 1,
      transferRef: transferRef,
      note : 1 || ''
    }

    res.send(createSlip)
  } catch (error) {
    console.log(`ERRORs transferMoneySuccess function : ${error}`)
    res.status(500).send('Request failed')
  }
})

async function updateMessageStatus (id) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZmRmZWFhMGY2Yzk5YTUyNjE0NTNkMjQ3MDc1NjA0ODJjMjBmZGFlNGI4M2MzYzdkOWRiOWNhNDkwNGI4NmYxMzcwYTQ1MzUzNjE5Yzk5ODMxMDAzMTA1NTQyYzljOTk3MGE2NzI0ZTRmNjE4MzAwZDc0MjU3ZmM3NzU4OWE0NjI2OTVmMjc2MGZhNTkwOTU4ZmI5M2NiZWU5ZTU2ZjA0ZjMzZGI2NDM0YmQxOGQ3OTE1Mjg3NjllMzZmMWFhYzQ0NzlhMjJkZTAxMWE5MDE3ZjhhYjFlMTZmNTYyM2QwN2FiMjMwMmI1MDliOTNiNTA4YTg1YmI0MGMyNWNjNmY1ZWU3MmUyYzM2MzIxZTk1IiwiaWF0IjoxNjI5NzgxODIzLCJleHAiOjE2NjEzMTc4MjN9.fESNbJwfreR_3L0YIl9JYVhK-ZO-5kXLtX8pTtzEQhE'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }
  // ถามแม็กเรื่อง metadata.status
  const postData = {
    message: {
      id: id,
      data: 'จ่ายแล้ว',
      metadata: {
        type: 'transfer',
        status: 'request'
      }
    },
    updateToStatus: 'paid'
  }

  try {
    const updateMsg = await axios.put(
      'http://localhost:5001/function-firebase-33727/us-central1/updateMessageStatus',
      postData,
      configAuth
    )
    return updateMsg
  } catch (error) {
    console.log(`updateMessageStatus() msg : ${error}`)
    console.log(error.response.data)
  }
}


async function getDataFromTransaction (id) {
  try {
    const transactionId = firestore.collection('transaction').doc(id)
    const data = await transactionId.get()
    return data.data()
  } catch (error) {
    console.log(`ERRORs getDataFromTransaction() msg : ${error} `)
  }
}

exports.transferMoneySuccess = builderFunction.onRequest(transferMoneySuccess)
