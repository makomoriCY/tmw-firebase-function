const functions = require('firebase-functions')
const builderFunction = functions.region('asia-southeast1').https

const checkWebhook = require('./routes/checkWebhook')
exports.checkWebhook = builderFunction.onRequest(
  checkWebhook.checkWebhook
)

const checkUserMutuality = require('./routes/checkUserMutuality')
exports.checkUserMutuality = builderFunction.onRequest(
  checkUserMutuality.checkUserMutuality
)

// const getBadWords = require('./routes/getBadWords')
// exports.getBadWords = builderFunction.onRequest(getBadWords.getBadWords)

// const sendNotification = require('./routes/sendNotification')
// exports.sendNotification = builderFunction.onRequest(
//   sendNotification.sendNotification
// )

const updateMessageStatus = require('./routes/updateMessageStatus')
exports.updateMessageStatus = builderFunction.onRequest(
  updateMessageStatus.updateMessageStatus
)

const transferMoneySuccess = require('./routes/transferMoneySuccess')
exports.transferMoneySuccess = builderFunction.onRequest(
  transferMoneySuccess.transferMoneySuccess
)

// const createTransaction = require('./version-firestore/createTransaction')
// exports.createTransaction = builderFunction.onRequest(
//   createTransaction.createTransaction
// )

// const getTransaction = require('./version-firestore/getTransaction')
// exports.getTransaction = builderFunction.onRequest(
//   getTransaction.getTransaction
// )

// const updateTransaction = require('./version-firestore/updateTransaction')
// exports.updateTransaction = builderFunction.onRequest(
//   updateTransaction.updateTransaction
// )

// const transferMoney = require('./version-firestore/transferMoney')
// exports.transferMoney = builderFunction.onRequest(
//   transferMoney.transferMoney
// )

const checkIsBlockFriend = require('./routes/checkIsBlockFriend')
exports.checkIsBlockFriend = builderFunction.onRequest(
  checkIsBlockFriend.checkIsBlockFriend
)

const addBlockList = require('./routes/addBlockList')
exports.addBlockList = builderFunction.onRequest(
  addBlockList.addBlockList
)

const removeFromBlockList = require('./routes/removeFromBlockList')
exports.removeFromBlockList = builderFunction.onRequest(
  removeFromBlockList.removeFromBlockList
)

const getBlockList = require('./routes/getBlockList')
exports.getBlockList = builderFunction.onRequest(
  getBlockList.getBlockList
)
