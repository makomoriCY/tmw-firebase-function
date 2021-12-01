const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https
const express = require('express')
const axios = require('axios')
require('dotenv').config()

const checkUserMutuality = express()

checkUserMutuality.post('/', async (req, res) => {
  const TOKEN = req.headers.authorization?.split(' ')[1]
  if (!TOKEN) return res.status(401).send('Authorization info not found')

  // const ID_LENGTH = 15
  // const REGEX = new RegExp('^[0-9]+$')
  try {
    const { owner_id: ownerId, friend_id: friendId } = req.body

    console.log({ ownerId, friendId })

    if (!ownerId || !friendId) return res.status(400).send('parameter require')

    // if (ownerId?.length !== ID_LENGTH || friendId?.length !== ID_LENGTH)
    //   return res.status(400).send('ID parameter length invalid')

    // if (!REGEX?.test(ownerId) || !REGEX?.test(friendId))
    //   return res.status(400).send('ID parameter invalid')

    const amityProfiles = await getProfileFromAmity(ownerId, friendId)

    if (!amityProfiles) return res.status(404).send('User not found')

    const trueProfiles = await getProfileFromTrue(ownerId, friendId)

    console.log({ amityProfiles, trueProfiles })

    const friendDetails = {
      owner: {
        id: amityProfiles.owner.id,
        displayName: `truemoney-${amityProfiles.owner.displayName}`,
        inContact: trueProfiles.data.owner.in_contact,
        inBlocklist: amityProfiles.owner.isOwnerGetBlock,
        image: trueProfiles.data.owner.images
      },
      friend: {
        id: amityProfiles.friend.id,
        displayName: `truemoney-${amityProfiles.friend.displayName}`,
        inContact: trueProfiles.data.friend.in_contact,
        inBlocklist: amityProfiles.friend.isFriendGetBlock,
        image: trueProfiles.data.friend.images
      }
    }

    console.log({
      friendDetails
    })

    res.send(friendDetails)
  } catch (error) {
    console.log(`ERRORs in checkUserMutuality function: ${error}`)
  }
})

async function getProfileFromAmity (ownerId, friendId) {
  const configAuth = {
    headers: { Authorization: `Bearer ${TOKEN}` }
  }

  try {
    const ownerProfile = await axios.get(
      `${process.env.PROD_URL}/v3/users/${ownerId}`,
      configAuth
    )

    const friendProfile = await axios.get(
      `${process.env.PROD_URL}/v3/users/${friendId}`,
      configAuth
    )

    const ownerBlockList = ownerProfile.data.metadata?.blockList
    const friendBlockList = friendProfile.data.metadata?.blockList

    const isOwnerGetBlock =
      friendBlockList?.some(user => user === ownerId) || false

    const isFriendGetBlock =
      ownerBlockList?.some(user => user === friendId) || false

    const response = {
      owner: {
        id: ownerId,
        displayName: ownerProfile.data.users[0].displayName,
        isOwnerGetBlock
      },
      friend: {
        id: friendId,
        displayName: friendProfile.data.users[0].displayName,
        isFriendGetBlock
      }
    }
    return response
  } catch (error) {
    console.log(`ERRORs in getAmityProfile ${error}`)
  }
}

async function getProfileFromTrue (ownerId, friendId) {
  const profile = {
    status: {
      code: '0',
      message: 'Success'
    },
    data: {
      owner: {
        tmn_id: 'tmn.10001066599',
        display_name: 'Owner 1',
        in_contact: true,
        images:
          'https://profile-images-alpha.s3-ap-southeast-1.amazonaws.com/bnk48?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20180703T083450Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAI6BLITGNNM4VYAUA%2F20180703%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=1d9b720b7adf955cfa9d0f26e506b5d03aa94b31d1ea752a9e87f541d3c09e20'
      },
      friend: {
        tmn_id: 'tmn.10001022033',
        display_name: 'Friend 1',
        in_contact: true,
        images:
          'https://profile-images-alpha.s3-ap-southeast-1.amazonaws.com/bnk48?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20180703T083450Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=AKIAI6BLITGNNM4VYAUA%2F20180703%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=1d9b720b7adf955cfa9d0f26e506b5d03aa94b31d1ea752a9e87f541d3c09e20'
      }
    }
  }

  return profile
}

exports.checkUserMutuality = builderFunction.onRequest(checkUserMutuality)
