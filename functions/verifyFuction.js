const crypto = require('crypto')
const fs = require('fs')

function getPrivateKeySomehow () {
    const privKey = fs.readFileSync('./private_key.pem', 'utf8')
    return privKey
  }
  
  const publicKey = getPublicKeySomehow()
  const privateKey = getPrivateKeySomehow()

const verifiableData = 'this need to be verified'

const signature = crypto.sign('sha256', Buffer.from(verifiableData), {
  key: privateKey,
  padding: crypto.constants.RSA_PKCS1_PSS_PADDING
})

console.log(signature.toString('base64'))

const isVerified = crypto.verify(
  'sha256',
  Buffer.from(verifiableData),
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING
  },
  signature
)

console.log('signature verified: ', isVerified)