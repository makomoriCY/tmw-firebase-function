const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const removeFromBlockList = express()

removeFromBlockList.delete('/', async (req, res) => {
  try {
    const { userId, bannedId } = req.body

    const userProfile = await getProfileFromAmity(userId)

    if (!userProfile) return res.status(404).send('User not found')

    let blockList = userProfile?.metadata?.blockList

    if (!blockList) return res.send('Block list not found')
    
    const list = blockList.filter(user => user !== bannedId)

    const data = await removeUser({ id: userId, list: list })
    if (!data) return res.status(404).send('Errors')

    return res.send('Unblocked Successfuly!')
  } catch (error) {
    console.log(`error in removeFromBlockList function: ${error}`)
    res.status(500)
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

async function removeUser ({ id, list }) {
  const token = process.env.ADMIN_TOKEN
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const postData = {
    userId: id,
    metadata: {
      blockList: list
    }
  }

  try {
    const { data } = await axios.put(
      `${process.env.PROD_URL}/v3/users`,
      postData,
      configAuth
    )

    return data
  } catch (error) {
    console.log(`ERRORs in removeUser : ${error}`)
  }
}

exports.removeFromBlockList = builderFunction.onRequest(removeFromBlockList)
