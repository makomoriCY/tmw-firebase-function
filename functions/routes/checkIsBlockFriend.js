const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const checkIsBlockFriend = express()

checkIsBlockFriend.get('/', async (req, res) => {
  try {
    const { userId, otherId } = req.body
    
    const userProfile = await getProfileFromAmity(userId)
    
    if(!userProfile) return res.status(404).send('User not found')
    
    const isBlock = userProfile?.metadata?.blockList?.some(
      user => user === otherId
    )
    
    !isBlock ? res.send(false) : res.send(isBlock)

  } catch (error) {
    console.log(`error in checkIsBlockFriend function: ${error}`)
  }
})

async function getProfileFromAmity (id) {
  // use token user
  const token = process.env.ADMIN_TOKEN
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    const profileAmity = await axios.get(
      `${process.env.PROD_URL}/v3/users/${id}`,
      configAuth
    )

    return profileAmity.data.users[0]
  } catch (error) {
    console.log(`ERRORs in getAmityProfile id: ${id} : ${error}`)
  }
}

exports.checkIsBlockFriend = builderFunction.onRequest(checkIsBlockFriend)
