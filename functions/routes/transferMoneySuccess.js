const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const axios = require('axios')

const transferMoneySuccess = express()

transferMoneySuccess.post('/', async (req, res) => {
  try {
    const {
      type,
      note,
      amount,
      currency,
      timestamp,
      messageId,
      transferId,
      senderProfile,
      receiverProfile
    } = req.body

    const reponse = {
      type: type,
      note: note,
      amount: amount,
      currency: currency,
      timestamp: timestamp,
      messageId: messageId,
      transferId: transferId,
      senderProfile: senderProfile,
      receiverProfile: receiverProfile
    }

    if (type === 'request') {
      const updateTransfer = await updateMessageStatus(messageId)
      if (!updateTransfer) return res.status(404).send('Cannot update message')
    }

    const checkUser = await checkUserMutuality({
      senderProfile: senderProfile,
      receiverProfile: receiverProfile
    })

    if (!checkUser) return res.status(404).send('Request failed')

    // สร้าง channel + msg

    return res.send(reponse)
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
    return updateMsg.data
  } catch (error) {
    console.log(`updateMessageStatus() msg : ${error}`)
    // console.log(error.response.data)
  }
}

async function checkUserMutuality ({ senderProfile, receiverProfile }) {
  try {
    const postData = { senderProfile, receiverProfile }
    const checkUserMutuality = await axios.post(
      'http://localhost:5001/function-firebase-33727/us-central1/checkUserMutuality',
      postData
    )
    return checkUserMutuality.data
  } catch (error) {
    console.log(`checkUserMutuality() msg : ${error}`)
  }
}

exports.transferMoneySuccess = builderFunction.onRequest(transferMoneySuccess)
