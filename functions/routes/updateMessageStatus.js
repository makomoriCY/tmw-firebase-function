const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const updateMessageStatus = express()

updateMessageStatus.put('/', async (req, res) => {
  try {
    const { message, updateToStatus } = req.body

    const searchMesseage = await getMessageFromAmity(message?.id)
    if (!searchMesseage) {
      console.log('ERRORs message not found', message?.id)
      res.status(404).json({
        error: 'Request failed "message not found" with status code 404'
      })
    }

    const updateStatus = await updateMessage({
      id: searchMesseage,
      status: updateToStatus
    })

    if (!updateStatus) {
      console.log('ERRORs message not update', message?.id)
      res.status(404).json({
        error: 'Request failed "message not update" with status code 404'
      })
    } else {
      const { messageId, data } = updateStatus

      const response = {
        message: {
          id: messageId,
          data: `[${data.text}] 55555`,
          metadata: {
            type: 'transfer',
            status: data.text
          }
        }
      }
      res.send(response)
    }
  } catch (error) {
    console.log(`ERRORs in updateMessage function: ${error}`)
    console.log('Message: ', req.body?.message?.id)
    console.log('UpdateTo: ', req.body?.updateToStatus)
    res.sendStatus(500)
  }
})

async function getMessageFromAmity (id) {
  const token = process.env.ADMIN_TOKEN
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    const msg = await axios.get(
      `${process.env.PROD_URL}/v3/messages/${id}`,
      configAuth
    )
    return msg.data?.messages[0]?.messageId
  } catch (error) {
    console.log(`ERRORs getMessageFromAmity() msg : ${error}`)
    // return error.response.data
  }
}

async function updateMessage ({ id, status }) {
  const token = process.env.ADMIN_TOKEN
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const updateData = {
    data: {
      text: status.toString()
    }
  }

  console.log(updateData)

  try {
    const msg = await axios.put(
      `${process.env.PROD_URL}/v3/messages/${id}`,
      updateData,
      configAuth
    )
    return msg.data?.messages[0]
  } catch (error) {
    console.log(error)
    console.log(`ERRORs updateMessage() msg : ${error}`)
  }
}

exports.updateMessageStatus = builderFunction.onRequest(updateMessageStatus)
