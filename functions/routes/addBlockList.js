const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const addBlockList = express()

addBlockList.post('/', async (req, res) => {
  try {
    const { userId, bannedId } = req.body

    const userProfile = await getProfileFromAmity(userId)
    
    if (!userProfile) return res.status(404).send('User not found')

    let blockList = userProfile?.metadata?.blockList

    if (!blockList) {
      const list = [bannedId]

      const data = await addToBlockList({ id: userId, list: list })
      if (!data) return res.status(404).send('Errors')

      return res.send('Block Successfuly!')
    }

    const checkUserExist = blockList?.some(user => user === bannedId)
    
    if(checkUserExist) return res.send('Block Successfuly!!')

    blockList.push(bannedId)

    const data = await addToBlockList({ id: userId, list: blockList })
    if (!data) return res.status(404).send('Errors')

    return res.send('Block Successfuly!')
  } catch (error) {
    console.log(`error in addBlockList function: ${error}`)
    res.status(500)
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

    return profileAmity.data.users[0]
  } catch (error) {
    console.log(`ERRORs in getAmityProfile id: ${id} : ${error}`)
  }
}

async function addToBlockList ({ id, list }) {
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
    console.log(`ERRORs in addToBlockList : ${error}`)
  }
}

exports.addBlockList = builderFunction.onRequest(addBlockList)
