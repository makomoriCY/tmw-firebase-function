const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const createChatRoom = express()

createChatRoom.post('/', async (req, res) => {
  try {
    //get profile from req?.body
    const senderProfile = req.body?.senderProfile
    const receiverProfile = req.body?.receiverProfile
    const senderBlockList = req.body?.senderProfile?.metadata?.blockList

    // get profile form amity backend
    let senderAmityProfile,
      receiverAmityProfile = {}

    senderAmityProfile = await getProfileFromAmity(senderProfile?.userId)
    receiverAmityProfile = await getProfileFromAmity(receiverProfile?.userId)

    // create amity profile
    if (!senderAmityProfile) {
      senderAmityProfile = await registerUser(senderProfile)
    }

    if (!receiverAmityProfile) {
      receiverAmityProfile = await registerUser(receiverProfile)
    }

    let senderTrueProfile,
      receiverTrueProfile = {}

    senderTrueProfile = await getProfileFromTrue(senderAmityProfile)
    receiverTrueProfile = await getProfileFromTrue(receiverAmityProfile)

    // check friend status from true backend
    const isFriend = await checkIsFriend({
      senderId: senderTrueProfile?.users?.userId,
      receiverId: receiverTrueProfile?.users?.userId
    })

    // find sender user blocked
    const isSenderBlockReceiver = senderBlockList?.some(
      user => user === receiverTrueProfile?.users?.userId
    )

    const response = {
      senderProfile: senderTrueProfile?.users,
      receiverProfile: receiverTrueProfile?.users,
      friendStatus: isFriend?.isFriend,
      blockListStatus: isSenderBlockReceiver || false
    }

    console.log({
      response
    })

    res.send(response)
  } catch (error) {
    console.log(`ERRORs in createChatRoom function: ${error}`)
    console.log('Sender: ', req.body?.senderProfile?.userId)
    console.log('Receiver: ', req.body?.receiverProfile?.userId)
  }
})

// get profile from amity backend
async function getProfileFromAmity (id) {
  const token = process.env.ADMIN_TOKEN
  const configAuth = {
    headers: { Authorization: `Bearer ${token}` }
  }

  try {
    const profileAmity = await axios.get(
      `${process.env.PREFIX_URL}/v3/users/${id}`,
      configAuth
    )

    return profileAmity.data
  } catch (error) {
    console.log(`ERRORs in getAmityProfile id: ${id} : ${error}`)
  }
}

// register user
async function registerUser (user) {
  //x-api-key ของ app เก็บเป็น static ไว้ที่ .env
  const configKeys = {
    headers: {
      'x-api-key': process.env.API_KEY
    }
  }
  //#improve: change device to parameter getting from req body
  const postData = {
    userId: user?.userId?.toString(),
    deviceId: 'deviceId_test',
    deviceInfo: {
      kind: 'ios',
      model: 'model_test',
      sdkVersion: 'sdkVersion_test'
    },
    displayName: user?.displayName?.toString(),
    authToken: 'authToken_test'
  }

  try {
    const register = await axios.post(
      'https://api.amity.co/api/v3/sessions',
      postData,
      configKeys
    )
    return register.data
  } catch (error) {
    console.log(`ERRORs in registerUser function : ${error}`)
  }
}

// get profile from true
// #improve: Fail case handle
async function getProfileFromTrue (user) {
  const profile = {
    users: {
      updatedAt: `true ${user?.users[0]?.displayName}`,
      createdAt: `true ${user?.users[0]?.createdAt}`,
      displayName: `true ${user?.users[0]?.displayName}`,
      userId: `${user?.users[0]?.userId}`,
      metadata: {},
      roles: [],
      permissions: [],
      flagCount: 0,
      hashFlag: null,
      avatarFileId: null
    }
  }
  return profile
}

// get friend status from true
async function checkIsFriend ({ senderId, receiverId }) {
  const isFriend = {
    isFriend: +senderId > +receiverId ? true : false
  }
  return isFriend
}

exports.createChatRoom = builderFunction.onRequest(createChatRoom)
