const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https

const createChatRoom = require('./routes/createChatRoom')
exports.createChatRoom = builderFunction.onRequest(
  createChatRoom.createChatRoom
)

const getBadWords = require('./routes/getBadWords')
exports.getBadWords = builderFunction.onRequest(getBadWords.getBadWords)

const sendNotification = require('./routes/sendNotification')
exports.sendNotification = builderFunction.onRequest(
  sendNotification.sendNotification
)

const updateMessageStatus = require('./routes/updateMessageStatus')
exports.updateMessageStatus = builderFunction.onRequest(
  updateMessageStatus.updateMessageStatus
)

const transferMoneySuccess = require('./routes/transferMoneySuccess')
exports.transferMoneySuccess = builderFunction.onRequest(
  transferMoneySuccess.transferMoneySuccess
)

const createTransaction = require('./version-firestore/createTransaction')
exports.createTransaction = builderFunction.onRequest(
  createTransaction.createTransaction
)

const getTransaction = require('./version-firestore/getTransaction')
exports.getTransaction = builderFunction.onRequest(
  getTransaction.getTransaction
)
