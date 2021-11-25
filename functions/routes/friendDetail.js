const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const friendDetail = express()

const { signature, craeteSignature } = require('../verifyFunction')

friendDetail.post('/', async (req, res) => {
  try {
    const { tmn_id_owner: ownerId, tmn_id_friend: friendId } = req.body

    if (!ownerId || !friendId) return res.status(422).send('Invalid data')

    const time = new Date().getTime()

    const postData = {
      tmn_id_owner: ownerId,
      tmn_id_friend: friendId
    }

    const verifiableData = time.toString() + JSON.stringify(postData)

    const sign = craeteSignature(verifiableData)

    const detail = getFriendDetail({ ownerId, friendId, time, sign })

    console.log({ ownerId, friendId, sign, verifiableData })

    return res.send(detail)
  } catch (error) {
    console.log(`ERRORs in friendDetail function: ${error}`)
  }
})

async function getFriendDetail ({ ownerId, friendId, time, sign }) {
  const config = {
    headers: {
      'x-api-key': '7a24336625754ac08850c755d2794029',
      Timestamp: time,
      'Content-Signature': `digest-alg=RSA-SHA; key-id=KEY:RSA:rsf.org; data=${sign}`
    }
  }

  const postData = {
    tmn_id_owner: ownerId,
    tmn_id_friend: friendId
  }

  try {
    const { data } = await axios.post(
      `https://api-b2b.tmn-dev.com/users/friend-details`,
      postData,
      config
    )
    return data
  } catch (error) {
    console.log('getFriendDetail function :', error?.response)
  }
}

exports.friendDetail = builderFunction.onRequest(friendDetail)
