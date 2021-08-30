class Transaction {
  constructor (
    transferId,
    messageId,
    amt,
    currency,
    timestamp,
    sender,
    receiver
  ) {
    this.transferId = transferId
    this.messageId = messageId
    this.amt = amt
    this.currency = currency
    this.timestamp = timestamp
    this.sender = sender
    this.receiver = receiver
  }
}

module.exports = Transaction
