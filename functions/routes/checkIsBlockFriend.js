const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const checkIsBlockFriend = express()

checkIsBlockFriend.post('/', async (req, res) => {
  try {
  
  } catch (error) {
    console.log(`error in checkIsBlockFriend function: ${error}`)
  }
})

async function getProfileFromAmity (id) {
  const token = process.env.ADMIN_TOKEN
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    const profileAmity = await axios.get(
      `${process.env.PROD_URL}/v3/users/${id}`,
      configAuth
    )

    return profileAmity.data
  } catch (error) {
    console.log(`ERRORs in getAmityProfile id: ${id} : ${error}`)
  }
}

exports.checkIsBlockFriend = builderFunction.onRequest(checkIsBlockFriend)
