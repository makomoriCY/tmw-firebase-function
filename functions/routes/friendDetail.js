const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const friendDetail = express()

const { signature } = require('../verifyFunction')

friendDetail.post('/', async (req, res) => {
  try {
    const { tmn_id_owner: ownerId, tmn_id_friend: friendId } = req.body

    const time = new Date().getTime()

    const postData = {
      tmn_id_owner: ownerId,
      tmn_id_friend: friendId
    }

    const verifiableData = time.toString() + JSON.stringify(postData)

    const sign = signature(verifiableData)

    const getDetail = getFriendDetail(ownerId, friendId, time, sign)
    console.log({ ownerId, friendId, getDetail, sign, verifiableData })
    return res.send(getDetail)
  } catch (error) {
    console.log(`ERRORs in friendDetail function: ${error}`)
  }
})

async function getFriendDetail (ownerId, friendId, time, sign) {
  const configAuth = {
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
      configAuth
    )
    return data
  } catch (error) {
    // console.log('err msg',error)
    console.log('err response',error?.response)
  }
}

exports.friendDetail = builderFunction.onRequest(friendDetail)
