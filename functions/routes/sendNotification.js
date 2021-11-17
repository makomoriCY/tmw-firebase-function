const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const sendNotification = express()

const ACCEPT_EVENT = 'message.didCreate'
const ACCEPT_TYPE = ['text', 'custom', 'image', 'file']

sendNotification.post('/', async (req, res) => {
  try {
    const {
      event,
      data: { messages, users }
    } = req.body

    const {
      userId: senderId,
      channelId,
      messageId,
      data,
      type,
      tags
    } = messages[0]

    const { amount, file, url, text } = data

    if (event !== ACCEPT_EVENT) {
      console.log('reject event ' + event)
      return res.status(422).send('Event Incorrect')
    }

    if (!ACCEPT_TYPE.includes(type)) {
      console.log('reject type ' + type)
      return res.status(422).send('Type Incorrect')
    }

    const userData = await getUserFromChanel(channelId)

    const receiverProfile = userData?.filter(user => user.userId !== senderId)

    const receiverId = receiverProfile[0].userId

    const senderBlockList = users[0]?.metadata?.blockList

    const receiverBlockList = receiverProfile[0]?.metadata?.blockList

    const isSenderBlockReceiver = senderBlockList?.find(user => {
      return user === receiverId
    })

    const isReceiverBlockSender = receiverBlockList?.find(user => {
      return user === senderId
    })

    // case custom -> p2p drop accept only r2p
    // custom & image not require properties

    let response
    const typeSlip = ['r2p', 'p2p']
    const templateName = tags?.filter(i => typeSlip.includes(i)).toString()

    switch (type) {
      case 'text':
        response = responseTypeText(receiverId, senderId, text)
        break
      case 'custom':
        response = responseTypeCustom(templateName, receiverId)
        break
      case 'image':
        response = responseTypeImage(receiverId, senderId, url)
        break
      case 'file':
        response = responseTypeFile(receiverId, senderId, file)
        break
      default:
        response = 'default case'
        break
    }

    console.log({
      senderId,
      channelId,
      amount,
      type,
      userData,
      receiverProfile,
      senderBlockList,
      receiverBlockList,
      isSenderBlockReceiver,
      isReceiverBlockSender,
      response,
      messageId
    })

    // ถ้า status 500 ให้ retry 3 ครั้ง

    if (isSenderBlockReceiver || isReceiverBlockSender)
      return res.send(dropNotification(messageId))

    return res.send(pushNotification({ response, messageId }))
  } catch (error) {
    console.log(`ERRORs in sendNotification function: ${error}`)
  }
})
// bulk api 10 msg or 5 sec
function pushNotification ({ response, messageId }) {
  const data = response
  console.log(`push notification message id : ${messageId}`)
  return data
}

function dropNotification (messageId) {
  const status = {
    status: false
  }
  console.log(`drop notification message id : ${messageId}`)
  return status
}

async function getUserFromChanel (channelId) {
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiZmRmZWFhMGY2Yzk5YTUyNjE0NTNkMjQ3MDc1NjA0ODJjMjVkODRlN2IyNjEzYTI4Y2JiYWNmMTgwNmVhMzExNTI1YTEwMzAzNjM5YmNjODYxMDA1NDMwYzE0YzQ5Yzk3NTgzNDcxYjdmNDQzMzUwYzc3MjE3YTkwMjE4ZWEzM2YzODBiMjAzNGFhNWMwYTVmZmRjMWM4Yjg5MzAxYTYxZDNiOGUzMzMzYjAxZTgwYzAwNGQ1M2ZiMTZhNGJhZDEzN2JhMjJkZTAxMWE5MDE3ZjhhYjFlMTZmNTYyM2QwNzNlZTM1MmUwMWMyYzdlNjAzZmM1OWI2NWU3Mjk5NjkwYWIzNzEyOTMzNjMxZTk1IiwiaWF0IjoxNjM2NjkyMzMxLCJleHAiOjE2NjgyMjgzMzF9.xP5lXEExR46HfGq9FbWq6Tn_ef0T14TTpEpJHvxhQAo'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    const { data } = await axios.get(
      `${process.env.PROD_URL}/v3/channels/${channelId}/users`,
      configAuth
    )
    const users = data.users
    return users
  } catch (error) {
    console.log(`getUserFromChanel() msg : ${error}`)
  }
}

// function response set validate params

function responseTypeText (receiverId, senderId, message) {
  const response = {
    templateName: 'text',
    tmnId: `tmn.${receiverId}`,
    properties: {
      from: senderId,
      message: message
    }
  }
  return response
}

function responseTypeCustom (template, receiverId) {
  const response = {
    templateName: template,
    tmnId: `tmn.${receiverId}`
  }
  return response
}

function responseTypeImage (receiverId, senderId, url) {
  const response = {
    templateName: 'image',
    tmnId: `tmn.${receiverId}`,
    properties: {
      from: senderId,
      url: url
    }
  }
  return response
}

function responseTypeFile (receiverId, senderId, file) {
  const response = {
    templateName: 'file',
    tmnId: `tmn.${receiverId}`,
    properties: {
      from: senderId,
      file: file
    }
  }
  return response
}

exports.sendNotification = builderFunction.onRequest(sendNotification)
