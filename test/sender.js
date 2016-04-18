/* global describe,it */
'use strict'
let should = require('should')
let Sender = require('../lib/sender.js')
let asink = require('asink')
let Privkey = require('fullnode/lib/privkey')
let Pubkey = require('fullnode/lib/pubkey')
let Script = require('fullnode/lib/script')
let Txout = require('fullnode/lib/txout')
let Address = require('fullnode/lib/address')
let BN = require('fullnode/lib/bn')

describe('Sender', function () {
  // generate data to initialize an sender
  let privkey = Privkey().fromBN(BN(30))
//  let privkey = Privkey().fromRandom()
  let pubkey = Pubkey().fromPrivkey(privkey)
  let address = Address().fromPubkey(pubkey)
  let msPrivkey = Privkey().fromBN(BN(40))
//  let msPubkey = Pubkey().fromPrivkey(msPrivkey)

  // generate data to initialize another sender (first cnlbuilder will need some of this data too)
  let otherPrivkey = Privkey().fromBN(BN(60))
  let otherPubkey = Pubkey().fromPrivkey(otherPrivkey)
  let otherAddress = Address().fromPubkey(otherPubkey)
  let otherMsPrivkey = Privkey().fromBN(BN(50))
  let otherMsPubkey = Pubkey().fromPrivkey(otherMsPrivkey)

  let consts = {
    fundingTx: '01000000010000000000000000000000000000000000000000000000000000000000000000000000006b483045022100c000cacbb96e644d8ecd80b7e729471ab64d7913a52ceb45b7c498394459fa6f0220338cad242d55e4379d95ebc839771930ea849a31243b8e4400013a2f90ea91400121036d2b085e9e382ed10b69fc311a03f8641ccfff21574de0927513a49d9a688a00ffffffff02002d31010000000017a914825d8d4a359b1caee1ea5191d43deaff2a87691487f08cc404000000001976a914896007cb039c6648498ba434b2d0ed00837c1a3588ac00000000',
    otherFundingTx: '01000000010000000000000000000000000000000000000000000000000000000000000000000000006b4830450221009a8d35af1dcb1ed0fc0f21e07ebd0a2bce88f9bfc973b083326bef9d74e7354c022029d23c39c3cb18bc2567c9c54e215c2c13f68fbaf3c67e3f3f3fb8b234eb0d5701210301257e93a78a5b7d8fe0cf28ff1d8822350c778ac8a30e57d2acfc4d5fb8c192ffffffff02809698000000000017a914825d8d4a359b1caee1ea5191d43deaff2a8769148770235d05000000001976a914687b4cd0cd3ddcc611aac541bf3ab6dc0b7ecb9588ac00000000',
    partialRefundTx: '010000000149917883684f5cbd2105ed83e90f695b2a57aaace9466320b85e4f424bfbb91d0000000092000047304402200829feb0dc5d027afeaaca6b8133e1c59fd010746fafe1dfca7634c136f58621022070a2ed2be2fceec1376956efd0cfe6edb4b6e2599416bc9639eba2590baa7c57014752210229757774cc6f3be1d5f1774aefa8f02e50bc64404230e7a67e8fde79bd559a9a210391de2f6bb67b11139f0e21203041bf080eacf59a33d99cd9f1929141bb0b4d0b52aeffffffff01f0053101000000001976a914896007cb039c6648498ba434b2d0ed00837c1a3588ace7382957',
    completeRefundTx: '010000000149917883684f5cbd2105ed83e90f695b2a57aaace9466320b85e4f424bfbb91d00000000da00483045022100fa63300d459ec162c7b60881ed000013f5379176c9774e5eedf6cfea24481a6602203c53cec3f43e8796b1311c33440346ec840dee22452c514ef66b02a5c876c7d90147304402200829feb0dc5d027afeaaca6b8133e1c59fd010746fafe1dfca7634c136f58621022070a2ed2be2fceec1376956efd0cfe6edb4b6e2599416bc9639eba2590baa7c57014752210229757774cc6f3be1d5f1774aefa8f02e50bc64404230e7a67e8fde79bd559a9a210391de2f6bb67b11139f0e21203041bf080eacf59a33d99cd9f1929141bb0b4d0b52aeffffffff01f0053101000000001976a914896007cb039c6648498ba434b2d0ed00837c1a3588ace7382957',
    partialPaymentTx: '010000000149917883684f5cbd2105ed83e90f695b2a57aaace9466320b85e4f424bfbb91d0000000092000047304402202641d88de6adc665c161899e862c0065352a216e3bf45c58a610c27df57fd09702206d7931e2f6c78692bae2d2e11d8c06d89f5c50d3b759f30d07ac8c028c7c8a4c014752210229757774cc6f3be1d5f1774aefa8f02e50bc64404230e7a67e8fde79bd559a9a210391de2f6bb67b11139f0e21203041bf080eacf59a33d99cd9f1929141bb0b4d0b52aeffffffff02404b4c000000000017a914687b4cd0cd3ddcc611aac541bf3ab6dc0b7ecb9587b0bae400000000001976a914896007cb039c6648498ba434b2d0ed00837c1a3588ac67e72757',
    completePaymentTx: '010000000149917883684f5cbd2105ed83e90f695b2a57aaace9466320b85e4f424bfbb91d00000000da004830450221009b918e851bd12259d066f7962869c119950c8de411885b7f66ea92f3b54daa3102205f04775fcea9bd7f037b00209dabe05981fbdf26be65be12ac0ca09dd42071700147304402202641d88de6adc665c161899e862c0065352a216e3bf45c58a610c27df57fd09702206d7931e2f6c78692bae2d2e11d8c06d89f5c50d3b759f30d07ac8c028c7c8a4c014752210229757774cc6f3be1d5f1774aefa8f02e50bc64404230e7a67e8fde79bd559a9a210391de2f6bb67b11139f0e21203041bf080eacf59a33d99cd9f1929141bb0b4d0b52aeffffffff02404b4c000000000017a914687b4cd0cd3ddcc611aac541bf3ab6dc0b7ecb9587b0bae400000000001976a914896007cb039c6648498ba434b2d0ed00837c1a3588ac67e72757'
  }

  it('should exist', function () {
    should.exist(Sender)
    should.exist(new Sender())
    should.exist(Sender())
  })

  describe('#asyncInitialize', function () {
    it('asyncInitialize should exist', function () {
      let sender = Sender()
      should.exist(sender.asyncInitialize)
    })

    it('asyncInitialize should set a multisig script and address', function () {
      return asink(function *() {
        let sender = Sender(privkey, msPrivkey, otherMsPubkey, otherAddress)
        yield sender.asyncInitialize()
        should.exist(sender.pubkey)
        should.exist(sender.address)
        should.exist(sender.keypair)
        should.exist(sender.msPubkey)
        should.exist(sender.msScript)
        should.exist(sender.msAddress)
        sender.initialized.should.equal(true)
      }, this)
    })
  })

  /* funding transaction */

  describe('#asyncBuildFundingTx', function () {
    it('asyncBuildFundingTx should create a funding tx', function () {
      return asink(function *() {
        // asyncInitialize an sender
        let sender = Sender(privkey, msPrivkey, otherMsPubkey, otherAddress)
        yield sender.asyncInitialize()

        // build output to be spent in funding transaction
        let scriptout = Script().fromString('OP_DUP OP_HASH160 20 0x' + address.hashbuf.toString('hex') + ' OP_EQUALVERIFY OP_CHECKSIG')
        let amount = BN(2e7)
        let txhashbuf = new Buffer(32).fill(0)
        let txoutnum = 0
        let txoutamount = BN(1e8)
        let txout = Txout(txoutamount, scriptout)

        let txb = yield sender.asyncBuildFundingTx(amount, txhashbuf, txoutnum, txout, pubkey)
        let tx = txb.tx

        tx.toString().should.equal(consts.fundingTx)

        let outValbn0 = tx.txouts[0].valuebn
        let outValbn1 = tx.txouts[1].valuebn

        // first output should equal amount
        outValbn0.eq(amount).should.equal(true)
        // sum of outputs should be smaller than inputs
        outValbn0.add(outValbn1).lt(txoutamount).should.equal(true)
        // there should be one output
        tx.toJSON().txins.length.should.equal(1)
        // and two inputs
        tx.toJSON().txouts.length.should.equal(2)
        ;(tx.toJSON().txouts[0].valuebn).should.equal(amount.toString())
        // senders balane should be updated
        sender.balance.should.equal(amount)
      }, this)
    })
  })
})