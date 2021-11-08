var crypto = require('crypto');
var fs = require('fs');
// var ALGORITHM = "sha384";
// var SIGNATURE_FORMAT = "hex";

function getPublicKeySomehow() {

var pubKey = fs.readFileSync('./public_key.pem', 'utf8');
//  console.log("\n>>> Public key: \n\n" + pubKey);

return pubKey;
}

function getPrivateKeySomehow() {

var privKey = fs.readFileSync('./private_key.pem', 'utf8');
//  console.log(">>> Private key: \n\n" + privKey);

return privKey;
}

// function createSignature(data) {
//     const keyBytes = getPrivateKeySomehow()
//     const h = crypto.createHash('sha256').update(data).digest('hex')
//     console.log('test', h)
// }


// function getSignatureToVerify(data) {

// var privateKey = getPrivateKeySomehow();
//  var sign = crypto.createSign(ALGORITHM);
//  sign.update(data);
//  var signature = sign.sign(privateKey, SIGNATURE_FORMAT);

// console.log(">>> Signature:\n\n" + signature);

// return signature;
// }

// var publicKey = getPublicKeySomehow();
// var verify = crypto.createVerify(ALGORITHM);
// var data = "This 555 666 message will be signed with a RSA private key in PEM format and then verified with a RSA public key in PEM format.";
// var signature = getSignatureToVerify(data);

// console.log('\n>>> Message:\n\n' + data);

// verify.update(data);

// var verification = verify.verify(publicKey, signature, SIGNATURE_FORMAT);

// console.log('\n>>> Verification result: ' + verification.toString().toUpperCase());


// const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
// 	// The standard secure default length for RSA keys is 2048 bits
// 	modulusLength: 2048,
// })

const publicKey = getPublicKeySomehow()
const privateKey = getPrivateKeySomehow()


const data = "my secret data 555"

const encryptedData = crypto.publicEncrypt(
    {
        key: publicKey,
		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: "sha256",
	},
	Buffer.from(data)
)

console.log("encypted data: ", encryptedData.toString("base64"))



const decryptedData = crypto.privateDecrypt(
	{
		key: privateKey,
		// In order to decrypt the data, we need to specify the
		// same hashing function and padding scheme that we used to
		// encrypt the data in the previous step
		padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
		oaepHash: "sha256",
	},
	encryptedData
)

// The decrypted data is of the Buffer type, which we can convert to a
// string to reveal the original data
console.log("decrypted data: ", decryptedData.toString())






// Create some sample data that we want to sign
const verifiableData = "this need to be verified"

// The signature method takes the data we want to sign, the
// hashing algorithm, and the padding scheme, and generates
// a signature in the form of bytes
const signature = crypto.sign("sha256", Buffer.from(verifiableData), {
	key: privateKey,
	padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
})

console.log(signature.toString("base64"))

// To verify the data, we provide the same hashing algorithm and
// padding scheme we provided to generate the signature, along
// with the signature itself, the data that we want to
// verify against the signature, and the public key
const isVerified = crypto.verify(
	"sha256",
	Buffer.from(verifiableData),
	{
		key: publicKey,
		padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
	},
	signature
)

// isVerified should be `true` if the signature is valid
console.log("signature verified: ", isVerified)