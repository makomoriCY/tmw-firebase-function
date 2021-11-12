const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const sendNotification = express()

sendNotification.post('/', async (req, res) => {
  try {
    const {
      event,
      data: { messages, users }
    } = req.body

    const { userId: senderId, channelId } = messages[0]

    const amount = users[0]?.metadata?.amount

    if (event !== 'message.didCreate') {
      console.log('reject event' + event)
      return res.status(422).send('Event Incorrect')
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

    const response = {
      templateName: 'p2p',
      tmnId: `tmn.${receiverId}`,
      properties: {
        from: senderId.toString(),
        amount: amount.toString()
      }
    }

    console.log({
      senderId,
      channelId,
      amount,
      userData,
      receiverProfile,
      senderBlockList,
      receiverBlockList,
      isSenderBlockReceiver,
      isReceiverBlockSender,
      response
    })

    // ถ้า status 500 ให้ retry 3 ครั้ง
    // เขียน log track msg id

    if (!isSenderBlockReceiver) {
      !isReceiverBlockSender
        ? res.send(pushNotification(response))
        : res.send(dropNotification())
    } else {
      res.send(dropNotification())
    }
  } catch (error) {
    console.log(`ERRORs in sendNotification function: ${error}`)
  }
})

function pushNotification (response) {
  const data = response
  return data
}

function dropNotification () { 
  const status = {
    status: false
  }
  console.log(`Notification status : ${status.status}`)
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

exports.sendNotification = builderFunction.onRequest(sendNotification)
