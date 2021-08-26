const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')

const sendNotification = express()

sendNotification.post('/', async (req, res) => {
  try {
    const messages = req.body
    const sender = req.body?.senderProfile
    const receiver = req.body?.receiverProfile

    // check user profile with true backend
    const senderProfile = await getProfileFromTrue(sender)
    const receiverProfile = await getProfileFromTrue(receiver)

    // get sender block list
    const senderBlockList = await getProfileFromAmity(senderProfile)

    // get receiver block list
    const receiverBlockList = await getProfileFromAmity(receiverProfile)

    // find sender user blocked
    const isSenderBlockReceiver = senderBlockList?.find(user => {
      return user === receiverProfile?.userId
    })

    //find receiver user blocked
    const isReceiverBlockSender = receiverBlockList?.find(user => {
      return user === senderProfile?.userId
    })

    if (!isSenderBlockReceiver) {
      !isReceiverBlockSender
        ? res.send(
            sentNotification({ id: receiverProfile?.userId, msg: messages })
          )
        : res.send(sentMessage({ id: receiverProfile?.userId, msg: messages }))
    } else {
      res.send(sentMessage({ id: receiverProfile?.userId, msg: messages }))
    }
  } catch (error) {
    console.log(`error msg : ${error}`)
  }
})

function sentNotification ({ id, msg }) {
  const status = {
    status: true
  }
  console.log(`์์Notification status : ${status.status}`)
  return status
}

function sentMessage ({ id, msg }) {
  const status = {
    status: false
  }
  console.log(`Notification status : ${status.status}`)
  return status
}

// fetch profile from true
function getProfileFromTrue (profile) {
  return profile
}

// check profile & get block list from amity backend
// ใช้แบบจำลองเพราะข้อมูลของจริงยังไม่มี blocklist
function getProfileFromAmity (profile) {
  return profile?.metadata?.blockList
}

exports.sendNotification = builderFunction.onRequest(sendNotification)

/**
 * @swagger
 * components:
 *   schemas:
 *     Noti:
 *       type: object
 *       required:
 *         - test
 *         - isFriend
 *       properties:
 *           profile:
 *             type: string
 *           type: string
 *           description: User id from UI KIT
 *       example:
 *         profile: 1
 */

/**
 * @swagger
 * tags:
 *   name: Noti
 *   description: managing API
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Noti
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: 555 API
 *     responses:
 *       200:
 *         description: ...
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Noti'
 */
