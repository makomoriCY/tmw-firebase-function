const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const getBlockList = express()

getBlockList.get('/', async (req, res) => {
  try {
    const { userId } = req.body

    const userProfile = await getProfileFromAmity(userId)

    return res.send(userProfile || [])
  } catch (error) {
    console.log(`error in getBlockList function: ${error}`)
    res.status(500)
  }

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

      return profileAmity.data.users[0].metadata.blockList
    } catch (error) {
      console.log(`ERRORs in getAmityProfile id: ${id} : ${error}`)
      return res.status(500).send('Server Errors')
    }
  }
})

exports.getBlockList = builderFunction.onRequest(getBlockList)
