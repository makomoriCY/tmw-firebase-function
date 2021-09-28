const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

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
      console.log('updateTransfer', updateTransfer)
      if (!updateTransfer) return res.status(404).send('Cannot update message')
    }

    // รอข้อมูลจาก true
    // const checkUser = await checkUserMutuality({
    //   senderProfile: senderProfile,
    //   receiverProfile: receiverProfile
    // })
    // console.log('checkUser', checkUser)
    // if (!checkUser) return res.status(404).send('Request failed')

    const channelId = await createConversation(receiverProfile?.userId)
    if (!channelId) return res.status(404).send('Cannot create conversation')

    const sendSlip = await createSlip({
      channelId: channelId,
      reponse: reponse
    })

    if (!sendSlip) return res.status(404).send('Cannot create slip')

    return res.send('Send slip successfully')
  } catch (error) {
    console.log(`ERRORs transferMoneySuccess function : ${error}`)
    res.status(500).send('Request failed')
  }
})

async function createSlip ({ channelId, reponse }) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZmRmZWFhMGY2Yzk5YTUyNjE0NTNkMjQ3MDc1NjA0ODJjMjU4ODVlYWJlNjE2ZTI0OWZiYzlmNGY1NmI2NmU0MDdjYTQ1NTUxMzA5OWNlZDAxMjA1MTM1YTEzYzVjYzk1MGM2NzI1ZTFmNjE2MzMwYzdkNzU3OTkxMmY4YWYwNjk2YTVkNzQ2NmE1MGU1ZTVjYWFjN2MzZWY5MTBmZjU0MjNmZGE2MjMxYjExZWQxOTM1M2QwM2VlMzM4MTlmYzQxN2NhMjJkZTAxMWE5MDE3ZjhhYjFlMTZmNTYyM2QwNzllNzY3N2I1NGM2OTZlMTA5YTkwY2U0NWM3NTllM2Y1OWIzN2EyYTMwMzMxZTk1IiwiaWF0IjoxNjMxODU4NjU5LCJleHAiOjE2NjMzOTQ2NTl9.TrUDDlTAAG_Z2j-nV3HeEB7WEEQdpwExT7DACUSkpzo'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const postData = {
    channelId: channelId,
    type: 'text',
    data: {
      text: reponse.note
    },
    metadata: {
      amount: reponse.amount,
      currency: reponse.currency,
      timestamp: reponse.timestamp,
      messageId: reponse.messageId,
      senderProfile: reponse.senderProfile,
      receiverProfile: reponse.receiverProfile
    },
    tags: ['transferSlip']
  }

  try {
    const { data } = await axios.post(
      `${process.env.PROD_URL}/v3/messages`,
      postData,
      configAuth
    )
    return data
  } catch (error) {
    console.log(`createSlip() msg : ${error}`)
  }
}

async function createConversation (receiverId) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZmRmZWFhMGY2Yzk5YTUyNjE0NTNkMjQ3MDc1NjA0ODJjMjU4ODVlYWJlNjE2ZTI0OWZiYzlmNGY1NmI2NmU0MDdjYTQ1NTUxMzA5OWNlZDAxMjA1MTM1YTEzYzVjYzk1MGM2NzI1ZTFmNjE2MzMwYzdkNzU3OTkxMmY4YWYwNjk2YTVkNzQ2NmE1MGU1ZTVjYWFjN2MzZWY5MTBmZjU0MjNmZGE2MjMxYjExZWQxOTM1M2QwM2VlMzM4MTlmYzQxN2NhMjJkZTAxMWE5MDE3ZjhhYjFlMTZmNTYyM2QwNzllNzY3N2I1NGM2OTZlMTA5YTkwY2U0NWM3NTllM2Y1OWIzN2EyYTMwMzMxZTk1IiwiaWF0IjoxNjMxODU4NjU5LCJleHAiOjE2NjMzOTQ2NTl9.TrUDDlTAAG_Z2j-nV3HeEB7WEEQdpwExT7DACUSkpzo'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const postData = {
    userIds: [receiverId],
    isDistinct: true,
    displayName: receiverId,
    metadata: {}
  }

  try {
    const convo = await axios.post(
      `${process.env.PROD_URL}/v3/channels/conversation`,
      postData,
      configAuth
    )
    return convo.data?.channels[0]?.channelId
  } catch (error) {
    console.log(`createConvosation() msg : ${error}`)
  }
}

async function updateMessageStatus (id) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZmRmZWFhMGY2Yzk5YTUyNjE0NTNkMjQ3MDc1NjA0ODJjMjU4ODVlYWJlNjE2ZTI0OWZiYzlmNGY1NmI2NmU0MDdjYTQ1NTUxMzA5OWNlZDAxMjA1MTM1YTEzYzVjYzk1MGM2NzI1ZTFmNjE2MzMwYzdkNzU3OTkxMmY4YWYwNjk2YTVkNzQ2NmE1MGU1ZTVjYWFjN2MzZWY5MTBmZjU0MjNmZGE2MjMxYjExZWQxOTM1M2QwM2VlMzM4MTlmYzQxN2NhMjJkZTAxMWE5MDE3ZjhhYjFlMTZmNTYyM2QwNzllNzY3N2I1NGM2OTZlMTA5YTkwY2U0NWM3NTllM2Y1OWIzN2EyYTMwMzMxZTk1IiwiaWF0IjoxNjMxODU4NjU5LCJleHAiOjE2NjMzOTQ2NTl9.TrUDDlTAAG_Z2j-nV3HeEB7WEEQdpwExT7DACUSkpzo'
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
    const { data } = await axios.put(
      'https://asia-southeast1-truemoney-50567.cloudfunctions.net/updateMessageStatus',
      postData,
      configAuth
    )
    return data
  } catch (error) {
    console.log(`updateMessageStatus() msg : ${error}`)
    // console.log(error.response.data)
  }
}

async function checkUserMutuality ({ senderProfile, receiverProfile }) {
  try {
    const postData = { senderProfile, receiverProfile }
    const { data } = await axios.post(
      'https://asia-southeast1-truemoney-50567.cloudfunctions.net/checkUserMutuality',
      postData
    )
    return data
  } catch (error) {
    console.log(`checkUserMutuality() msg : ${error}`)
  }
}

exports.transferMoneySuccess = builderFunction.onRequest(transferMoneySuccess)
