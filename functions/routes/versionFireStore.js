const functions = require('firebase-functions')
const builderFunction = functions.region('us-central1').https
const express = require('express')

const versionFireStore = express()

versionFireStore.get('/', async (req, res) => {
  
})

exports.versionFireStore = builderFunction.onRequest(versionFireStore)
