const crypto = require('crypto')
const fs = require('fs')

function getPublicKeySomehow () {
  const plbKey = fs.readFileSync('./public_key.pem', 'utf8')
  return plbKey
}

function getPrivateKeySomehow () {
  const privKey = fs.readFileSync('./private_key.pem', 'utf8')
  return privKey
}

const publicKey = getPublicKeySomehow()
const privateKey = getPrivateKeySomehow()

const signature = verifiableData => {
  const vData = verifiableData
  const data = crypto.sign('sha256', Buffer.from(vData), {
    key: privateKey,
    padding: crypto.constants.RSA_PKCS1_PSS_PADDING
  })
  return data.toString('base64')
}

// console.log(signature.toString('base64'))

// const isVerified = crypto.verify(
//   'sha256',
//   Buffer.from(verifiableData),
//   {
//     key: publicKey,
//     padding: crypto.constants.RSA_PKCS1_PSS_PADDING
//   },
//   signature
// )

// console.log('signature verified: ', isVerified)

// Example from true

function craeteSignature(data) {
  var signar = crypto.createSign('sha256');
  let private_key = fs.readFileSync('./private_key.pem').toString()
  signar.update(data);
  return signar.sign(private_key, 'base64');
}

// function verifySignature(signature, data) {
//   var varifier = crypto.createVerify('sha256')
//   var public_key = fs.readFileSync('./public_key.pem').toString()
//   varifier.update(data)
//   return varifier.verify(public_key, signature, 'base64')
// }

module.exports = { signature, craeteSignature }
