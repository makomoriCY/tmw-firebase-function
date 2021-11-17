const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const friendDetail = express()

const {
    signature,
    isVerified
  } = require('../verifyFuction')

friendDetail.post('/', async (req, res) => {
  try {
    res.send('test')
  } catch (error) {
    console.log(`ERRORs in friendDetail function: ${error}`)
  }
})

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

exports.friendDetail = builderFunction.onRequest(friendDetail)
