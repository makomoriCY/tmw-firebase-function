const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const axios = require('axios')

const transferMoney = express()

transferMoney.post('/', async (req, res) => {
  try {
    const { transferId } = req.body

    const updateMessage = await updateMessageStatus(transferId)

    const transferData = await getTransaction(transferId)

    if (updateMessage) {
      const sendNoti = await sendNotification(transferData)
      sendNoti
        ? res.send('transfer success')
        : res.status(404).json({
            error:
              'Request failed: could not send notification with  status code 404'
          })
    } else {
      res.status(404).json({
        error: 'Request failed: could not update message  with status code 404'
      })
    }
  } catch (error) {
    console.log(`ERRORs transferMoneySuccess function : ${error}`)
    console.log('transactionId: ', req.body.transferId)
    res.sendStatus(500)
  }
})

async function getTransaction (id) {
  try {
    const msg = await axios.get(
      `http://localhost:5001/function-firebase-33727/us-central1/getTransaction/${id}`
    )
    return msg.data
  } catch (error) {
    console.log(`ERRORs getMessageFromTransaction() msg : ${error}`)
  }
}

// update message
async function updateMessageStatus (data) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZmRmZWFhMGY2Yzk5YTUyNjE0NTNkMjQ3MDc1NjA0ODJjMjBmZGFlNGI4M2MzYzdkOWRiOWNhNDkwNGI4NmYxMzcwYTQ1MzUzNjE5Yzk5ODMxMDAzMTA1NTQyYzljOTk3MGE2NzI0ZTRmNjE4MzAwZDc0MjU3ZmM3NzU4OWE0NjI2OTVmMjc2MGZhNTkwOTU4ZmI5M2NiZWU5ZTU2ZjA0ZjMzZGI2NDM0YmQxOGQ3OTE1Mjg3NjllMzZmMWFhYzQ0NzlhMjJkZTAxMWE5MDE3ZjhhYjFlMTZmNTYyM2QwN2FiMjMwMmI1MDliOTNiNTA4YTg1YmI0MGMyNWNjNmY1ZWU3MmUyYzM2MzIxZTk1IiwiaWF0IjoxNjI5NzgxODIzLCJleHAiOjE2NjEzMTc4MjN9.fESNbJwfreR_3L0YIl9JYVhK-ZO-5kXLtX8pTtzEQhE'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const postData = {
    message: {
      id: data?.messageId,
      data: 'kkkkkk',
      metadata: {
        type: 'transfer',
        status: 'request'
      }
    },
    updateToStatus: 'paid'
  }

  try {
    const updateMsg = await axios.put(
      'http://localhost:5001/function-firebase-33727/us-central1/updateTransaction',
      postData,
      configAuth
    )
    return updateMsg
  } catch (error) {
    console.log(`updateMessageStatus() msg : ${error}`)
    console.log(error.response.data)
  }
}

// send notification
async function sendNotification (data) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZmRmZWFhMGY2Yzk5YTUyNjE0NTNkMjQ3MDc1NjA0ODJjMjBmZGFlNGI4M2MzYzdkOWRiOWNhNDkwNGI4NmYxMzcwYTQ1MzUzNjE5Yzk5ODMxMDAzMTA1NTQyYzljOTk3MGE2NzI0ZTRmNjE4MzAwZDc0MjU3ZmM3NzU4OWE0NjI2OTVmMjc2MGZhNTkwOTU4ZmI5M2NiZWU5ZTU2ZjA0ZjMzZGI2NDM0YmQxOGQ3OTE1Mjg3NjllMzZmMWFhYzQ0NzlhMjJkZTAxMWE5MDE3ZjhhYjFlMTZmNTYyM2QwN2FiMjMwMmI1MDliOTNiNTA4YTg1YmI0MGMyNWNjNmY1ZWU3MmUyYzM2MzIxZTk1IiwiaWF0IjoxNjI5NzgxODIzLCJleHAiOjE2NjEzMTc4MjN9.fESNbJwfreR_3L0YIl9JYVhK-ZO-5kXLtX8pTtzEQhE'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const postData = {
    message: {
      id: data?.messageId,
      text: 'Hello world to 29.'
    },
    senderProfile: {
      displayName: 'I am 35',
      userId: data?.sender,
      metadata: {
        blockList: ['1', '23']
      },
      avatarFileId: null
    },
    receiverProfile: {
      displayName: 'I am 29',
      userId: data?.receiver,
      metadata: {},
      avatarFileId: null
    }
  }

  try {
    const sendNoti = await axios.post(
      'http://localhost:5001/function-firebase-33727/us-central1/sendNotification',
      postData,
      configAuth
    )
    return sendNoti
  } catch (error) {
    console.log(`sendMessageNotification() msg : ${error}`)
  }
}

exports.transferMoney = builderFunction.onRequest(transferMoney)
