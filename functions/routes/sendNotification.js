const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const sendNotification = express()

const { craeteSignature } = require('../verifyFunction')

const ACCEPT_EVENT = 'message.didCreate'
const ACCEPT_TYPE = ['text', 'custom', 'image', 'file']
const DROP_OFF_TAGS = ['payslip', 'blockee']
const TYPE_SLIP = ['request']
const VALIDATE_FAIL = 'VALIDATE_FAIL'

sendNotification.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) return res.status(401).send('Authorization info not found')

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

  if (tags.some(i => DROP_OFF_TAGS.includes(i))) {
    return res.send(dropNotification(messageId))
  }

  try {
    const userData = await getUserFromChanel(channelId)

    const receiverProfile = userData?.filter(user => user.userId !== senderId)

    const receiverId = receiverProfile[0].userId

    let payload

    const templateName = tags?.filter(i => TYPE_SLIP.includes(i)).toString()
    switch (type) {
      case 'text':
        payload = payloadTypeText(receiverId, senderId, text)
        break
      case 'custom':
        if (!templateName) return res.status(422).send('Type slip Incorrect')
        payload = payloadTypeCustom(templateName, receiverId)
        break
      case 'image':
        payload = payloadTypeImage(receiverId, senderId, url)
        break
      case 'file':
        payload = payloadTypeFile(receiverId, senderId, file)
        break
      default:
        payload = VALIDATE_FAIL
        break
    }

    console.log({ userData, receiverId, payload })
    if (payload === VALIDATE_FAIL)
      return res.status(422).send('Parameter require')

    // const time = new Date().getTime()

    // const postData = payload

    // const verifiableData = time.toString() + JSON.stringify(postData)

    // const sign = craeteSignature(verifiableData)

    // const pushNoti = await pushNotification(payload, time, sign)

    // if (!pushNoti) return res.status(500).send('Can not push notification')

    return res.send(`Push notification message id : ${messageId}`)
  } catch (error) {
    console.log(`send notification() err msg : ${error}`)
  }

  async function getUserFromChanel (channelId) {
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

  // bulk api 10 msg or 5 sec
  async function pushNotification (payload, time, sign) {
    const configAuth = {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-api-key': '7a24336625754ac08850c755d2794029',
        Timestamp: time,
        'Content-Signature': `digest-alg=RSA-SHA; key-id=KEY:RSA:rsf.org; data=${sign}`
      }
    }

    const postData = payload

    try {
      const { data } = await axios.post(
        'https://api-b2b.tmn-dev.com/notification/send',
        postData,
        configAuth
      )
      console.log('sss', data)
      return data
    } catch (error) {
      console.log(`push notification() err msg : ${error}`)
    }
  }
})

function dropNotification (messageId) {
  const status = {
    status: false
  }
  console.log(`drop notification message id : ${messageId}`)
  return status
}

function payloadTypeText (receiverId, senderId, message) {
  if (!(receiverId && senderId && message)) {
    return VALIDATE_FAIL
  }
  const payload = {
    templateName: 'text',
    tmnId: `tmn.${receiverId}`,
    properties: {
      from: senderId,
      message: message
    }
  }
  return payload
}

function payloadTypeCustom (template, receiverId) {
  if (!(template && receiverId)) {
    return VALIDATE_FAIL
  }
  const payload = {
    templateName: template,
    tmnId: `tmn.${receiverId}`
  }
  return payload
}

function payloadTypeImage (receiverId, senderId, url) {
  if (!(receiverId && senderId && url)) {
    return VALIDATE_FAIL
  }
  const payload = {
    templateName: 'image',
    tmnId: `tmn.${receiverId}`,
    properties: {
      from: senderId,
      url: url
    }
  }
  return payload
}

function payloadTypeFile (receiverId, senderId, file) {
  if (!(receiverId && senderId && file)) {
    return VALIDATE_FAIL
  }
  const payload = {
    templateName: 'file',
    tmnId: `tmn.${receiverId}`,
    properties: {
      from: senderId,
      file: file
    }
  }
  return payload
}

exports.sendNotification = builderFunction.onRequest(sendNotification)
