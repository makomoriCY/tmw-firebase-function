const admin = require('firebase-admin')
const axios = require('axios')
require('dotenv').config()
const jwt = require('jsonwebtoken')
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

// const createToken = (req, res) => {
//   const { username, password } = req.body
//   if (!(username && password)) return res.status(400).send('All input require')

//   try {
//     const token = jwt.sign({ username, password }, SECRET_KEY, {
//       expiresIn: '7d'
//     })
//     res.json({ token })
//   } catch (error) {
//     res.status(400).send(error)
//   }
// }

// const verifyToken = (req, res, next) => {
//   try {
//     const idToken = req.headers.authorization.split('Bearer ')[1]
//     const decoded = jwt?.verify(idToken, SECRET_KEY)
//     const { username, password } = decoded
//     if (username !== MOCK_USERNAME || password !== MOCK_PASSWORD)
//       return res.status(403).send('Unauthorized')

//     next()
//   } catch (error) {
//     res.status(403).send(error)
//   }
// }

// const validateFirebaseIdToken = async (req, res, next) => {
//   console.log('Check if request is authorized with Firebase ID token')

//   if (
//     (!req.headers.authorization ||
//       !req.headers.authorization.startsWith('Bearer ')) &&
//     !(req.cookies && req.cookies.__session)
//   ) {
//     console.error('No Firebase ID token')
//     res.status(403).send('Unauthorized')
//     return
//   }

//   let idToken
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer ')
//   ) {
//     console.log('Found "Authorization" header')
//     // Read the ID Token from the Authorization header.
//     idToken = req.headers.authorization.split('Bearer ')[1]
//   } else if (req.cookies) {
//     console.log('Found "__session" cookie')
//     // Read the ID Token from cookie.
//     idToken = req.cookies.__session
//   } else {
//     // No cookie
//     res.status(403).send('Unauthorized')
//     return
//   }

//   try {
//     const decodedIdToken = await admin.auth().verifyIdToken(idToken)
//     console.log('ID Token correctly decoded', decodedIdToken)
//     req.user = decodedIdToken
//     next()
//     return
//   } catch (error) {
//     console.error('Error while verifying Firebase ID token:', error)
//     res.status(403).send('Unauthorized')
//     return
//   }
// }

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

// const getToken = async ({ userId, serverKey }) => {
//   const configAuth = {
//     headers: { 'x-server-key': serverKey }
//   }

//   try {
//     const token = await axios.get(
//       `${process.env.PROD_URL}/v3/authentication/token?userId=${userId}`,
//       configAuth
//     )
//     console.log('token', token.data)
//     return token.data
//   } catch (error) {
//     console.log(`ERRORs in getToken() : ${error}`)
//   }
// }

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

/**
 * 1. https://api.amity.co/api/v3/authentication/token?userId=2
 * - ส่ง x-api-keys มาใน headers + userId
 *
 * 2. https://api.amity.co/api/v3/sessions
 * - เอา token ไปลงทะเบียน sessions
 *
 * เอา accessToken ไปใช้งาน
 */
