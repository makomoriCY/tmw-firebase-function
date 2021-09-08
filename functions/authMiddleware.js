const axios = require('axios')
require('dotenv').config()
var CryptoJS = require('crypto-js')

const MOCK_USERNAME = process.env.MOCK_USERNAME
const MOCK_PASSWORD = process.env.MOCK_PASSWORD
const ADMINROLE = `${MOCK_USERNAME}:${MOCK_PASSWORD}`
const SECRET_KEY = process.env.SECRET_KEY

const createToken = (req, res) => {
  const { username, password } = req.body
  if (!(username && password)) return res.status(400).send('All input require')

  try {
    const originalText = CryptoJS.AES.encrypt(
      `${username}:${password}`,
      SECRET_KEY
    ).toString()
    res.json({ originalText })
  } catch (error) {
    res.status(400).send(error)
  }
}

const verifyToken = (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split('Bearer ')[1]
    const bytes = CryptoJS.AES.decrypt(idToken, SECRET_KEY)
    const originalText = bytes.toString(CryptoJS.enc.Utf8)
    console.log({
      idToken,
      bytes,
      originalText,
      ADMINROLE
    })
    if (originalText !== ADMINROLE) return res.status(403).send('Unauthorized')
    next()
  } catch (error) {
    res.status(403).send(error)
  }
}

const validateAmityIdToken = async (req, res, next) => {
  const userId = req.body?.userId
  const apiKey = req.header('x-api-key')
  const token = req.headers.authorization.split('Bearer ')[1]

  if (!(userId && apiKey && token)) return res.status(403).send('Unauthorized')

  try {
    const accessToken = await registerSession({
      userId: userId,
      token: token,
      apiKey: apiKey
    })

    if (!accessToken) return res.status(403).send('Unauthorized')

    next()
  } catch (error) {
    console.log(`ERRORs in main auth() : ${error}`)
  }
}

const registerSession = async ({ userId, token, apiKey }) => {
  const configAuth = {
    headers: { 'x-api-key': apiKey }
  }

  const postData = {
    userId: userId,
    deviceId: 'deviceId',
    deviceInfo: {
      kind: 'ios',
      model: 'string',
      sdkVersion: 'string'
    },
    authToken: token
  }
  try {
    const accessToken = await axios.post(
      `${process.env.PROD_URL}/v3/sessions`,
      postData,
      configAuth
    )
    console.log('accessToken', accessToken)
    return accessToken.data?.accessToken
  } catch (error) {
    console.log(`ERRORs in registerSession() : ${error}`)
  }
}

module.exports = {
  validateAmityIdToken,
  verifyToken,
  createToken
}

