const crypto = require('crypto')
const fs = require('fs')

// use in message

function getPublicKeySomehow () {
  const pubKey = fs.readFileSync('./public_key.pem', 'utf8')
  return pubKey
}

function getPrivateKeySomehow () {
  const privKey = fs.readFileSync('./private_key.pem', 'utf8')
  return privKey
}

const publicKey = getPublicKeySomehow()
const privateKey = getPrivateKeySomehow()

const data = 'my secret data'

const encryptedData = crypto.publicEncrypt(
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256'
  },
  Buffer.from(data)
)

console.log('encypted data: ', encryptedData.toString('base64'))

const decryptedData = crypto.privateDecrypt(
  {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: 'sha256'
  },
  encryptedData
)

console.log('decrypted data: ', decryptedData.toString())


