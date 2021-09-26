const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const getBlockList = express()

getBlockList.get('/', async (req, res) => {
  try {
    const { userId } = req.body

    const list = (await getProfileFromAmity(userId)) || []

    return res.send(list)
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
      console.log(profileAmity)
      return profileAmity.data.users[0].metadata.blockList
    } catch (error) {
      console.log(`ERRORs in getAmityProfile id: ${id} : ${error}`)
      return res
        .status(ConvertStatusCode(error.response.data.code))
        .send(error.response.data.message)
    }
  }
})

function ConvertStatusCode (status) {
  let code
  switch (status) {
    case 400400:
      code = 404
      break
    case 400300:
      code = 403
      break
    case 500000:
      code = 500
      break
    default:
      code = 500
  }
  return code
}

exports.getBlockList = builderFunction.onRequest(getBlockList)
