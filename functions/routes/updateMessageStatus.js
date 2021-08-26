const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const axios = require('axios')

const updateMessageStatus = express()

updateMessageStatus.put('/', async (req, res) => {
  try {
    const { message, updateToStatus } = req.body

    const searchMesseage = await getMessage(message?.id)

    if (!searchMesseage) {
      res.status(404).json({ error: 'Request failed with status code 404' })
    } else {
      const updateStatus = await updateMessage({
        id: searchMesseage[0]?.messageId,
        status: updateToStatus
      })

      if (!updateStatus) {
        res.status(404).json({ error: 'Request failed with status code 404' })
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
    }
  } catch (error) {
    console.log(`error msg : ${error}`)
    res.sendStatus(500)
  }
})

async function getMessage (id) {
  // token ของแอดมิน
  const token = 'a6d30ac240300caecf1b1fabeead75600999a530'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    const msg = await axios.get(
      `https://api.amity.co/api/v3/messages/${id}`,
      configAuth
    )
    return msg.data?.messages
  } catch (error) {
    console.log(`getMessage() msg : ${error}`)
    // return error.response.data
  }
}

async function updateMessage ({ id, status }) {
  // token ของแอดมิน
  const token = 'a6d30ac240300caecf1b1fabeead75600999a530'
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const updateData = {
    data: {
      text: status.toString()
    }
  }

  try {
    const msg = await axios.put(
      `https://api.amity.co/api/v3/messages/${id}`,
      updateData,
      configAuth
    )
    return msg.data?.messages[0]
  } catch (error) {
    console.log(`updateMessage() msg : ${error}`)
  }
}

exports.updateMessageStatus = builderFunction.onRequest(updateMessageStatus)
