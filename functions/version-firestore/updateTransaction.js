const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const updateTransaction = express()

updateTransaction.put('/', async (req, res) => {
  try {
    const { transferId } = req.body

    const searchMesseageTransaction = await getMessageFromTransaction(
      transferId
    )

    const searchMesseage = await getMessage(searchMesseageTransaction)

    console.log({ searchMesseageTransaction, searchMesseage })

    if (!searchMesseage) {
      console.log('ERRORs message not found')
      res.status(404).json({
        error: 'Request failed "message not found" with status code 404'
      })
    }

    const updateStatus = await updateMessage({
      id: searchMesseage[0]?.messageId,
      status: 'paid'
    })

    if (!updateStatus) {
      console.log('ERRORs message not update')
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
    res.sendStatus(500)
  }
})

async function getMessageFromTransaction (id) {
  try {
    const msg = await axios.get(
      `http://localhost:5001/function-firebase-33727/us-central1/getTransaction/${id}`
    )
    return msg.data?.messageId
  } catch (error) {
    console.log(`ERRORs getMessageFromTransaction() msg : ${error}`)
  }
}

async function getMessage (id) {
  // token admin
  const token = process.env.ADMIN_TOKEN
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    const msg = await axios.get(`${process.env.PROD_URL}/v3/messages/${id}`, configAuth)
    console.log('pls', msg.data)
    return msg.data
  } catch (error) {
    console.log(`ERRORs getMessage() msg : ${error}`)
    // return error.response.data
  }
}

async function updateMessage ({ id, status }) {
  // token admin
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
    console.log(`ERRORs updateMessage() msg : ${error}`)
  }
}

exports.updateTransaction = builderFunction.onRequest(updateTransaction)
