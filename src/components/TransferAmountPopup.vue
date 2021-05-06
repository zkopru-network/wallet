<template>
  <Popup :visible="visible" :onCancel="onCancel" :onComplete="onComplete">
    <div class="popup-title">
      Transfer
    </div>
    <div spacer style="height: 32px" />
    <div>
      <input type="text" v-model="etherAmount" /> <span style="color: white">Ether</span>
    </div>
    <div>
      <input type="text" v-model="gweiPerByte" /> <span style="color: white">Gwei per byte</span>
    </div>
    <div spacer style="height: 32px" />
    <div spacer style="height: 32px" />
    <Button :onClick="() => transfer()">
      Send
    </Button>
  </Popup>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Popup from './Popup'
import Button from './Button'
import { toWei } from '../utils/wei'

@Component({
  name: 'TransferAmountPopup',
  components: { Popup, Button, },
  props: [ 'visible', 'onCancel', 'onComplete', 'recipient' ],
})
export default class TransferAmountPopup extends Vue {
  etherAmount = ''
  gweiPerByte = '2000'
  async transfer() {
    try {
      if (!this.$store.state.zkopru.wallet) {
        await this.$store.dispatch('loadWallet')
      }
      // generate an l2 tx
      const tx = await this.$store.state.zkopru.wallet.generateEtherTransfer(
        this.recipient,
        toWei(this.etherAmount),
        (+this.gweiPerByte * (10 ** 9)).toString()
      )
      await this.$store.state.zkopru.wallet.wallet.sendTx({
        tx,
        encryptTo: this.recipient,
      })
      await this.$store.dispatch('loadL2Balance')
      this.onComplete()
    } catch (err) {
      console.log(err)
    }
  }
}
</script>

<style scoped>
</style>
