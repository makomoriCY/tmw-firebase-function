const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const transferMoneySuccess = express()

transferMoneySuccess.post('/', async (req, res) => {
  const TOKEN = req.headers.authorization.split(' ')[1]

  try {
    const {
      note,
      amount,
      ownerId,
      friendId,
      currency,
      timestamp,
      transferId,
      referenceId,
      transferDate
    } = req.body

    const prepareId = [ownerId, friendId].sort().join('-')

    const queryChannel = await checkChannelsExist(prepareId)

    var channelId = prepareId

    if (!queryChannel) {
      const data = await createChatRoom(prepareId, friendId)
      if (!data) res.status(500).send('Cannot create chat room')
      channelId = data
    }

    const reponse = {
      note,
      amount,
      ownerId,
      currency,
      friendId,
      timestamp,
      transferId,
      referenceId,
      transferDate
    }

    const sendSlip = await createSlip(channelId, reponse)

    if (!sendSlip) return res.status(500).send('Cannot create slip')

    return res.json('Succesfully!')
  } catch (error) {
    console.log(`transfer money success() err msg : ${error}`)
  }

  async function checkChannelsExist (prepareId) {
    try {
      const configAuth = {
        headers: { Authorization: `Bearer ${TOKEN}` }
      }

      const { data } = await axios.get(
        `${process.env.PROD_URL}/v3/channels/${prepareId}`,
        configAuth
      )

      return data?.channels[0]?.channelId
    } catch (error) {
      console.log(`check channels exist() err msg : ${error}`)
    }
  }

  async function createChatRoom (prepareId, friendId) {
    const configAuth = {
      headers: { Authorization: `Bearer ${TOKEN}` }
    }
    const postData = {
      channelId: prepareId,
      type: 'community',
      metadata: {},
      tags: ['string'],
      userIds: [friendId]
    }

    try {
      const { data } = await axios.post(
        `${process.env.PROD_URL}/v3/channels`,
        postData,
        configAuth
      )
      return data?.channels[0]?.channelId
    } catch (error) {
      console.log(`create chat room() err msg : ${error}`)
    }
  }

  async function createSlip (channelId, reponse) {
    const configAuth = {
      headers: { Authorization: `Bearer ${TOKEN}` }
    }
    const postData = {
      channelId,
      type: 'custom',
      data: {
        transferId: reponse.transferId,
        referenceId: reponse.referenceId,
        amount: reponse.amount,
        currency: reponse.currency,
        friendId: reponse.friendId,
        channel: 'truemoney',
        transferDate: reponse.transferDate,
        timestamp: reponse.timestamp,
        note: reponse.note
      },
      tags: ['payslip']
    }

    try {
      const { data } = await axios.post(
        `${process.env.PROD_URL}/v3/messages`,
        postData,
        configAuth
      )
      return data
    } catch (error) {
      console.log(`create slip() err msg : ${error}`)
    }
  }
})

exports.transferMoneySuccess = builderFunction.onRequest(transferMoneySuccess)
