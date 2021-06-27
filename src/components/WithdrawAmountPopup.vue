<template>
  <Popup :visible="visible" :onCancel="onCancel" :onComplete="onComplete">
    <div class="popup-title">
      Withdraw Ether
    </div>
    <div spacer style="height: 32px" />
    <div>
      <input type="text" v-model="etherAmount" /> <span style="color: white">Ether</span>
    </div>
    <div>
      <input type="text" v-model="gweiPerByte" /> <span style="color: white">Gwei per byte</span>
    </div>
    <div>
      <input type="text" v-model="prepayEtherFee" /> <span style="color: white">Prepay fee (Ether) (optional)</span>
    </div>
    <div spacer style="height: 32px" />
    <div spacer style="height: 32px" />
    <Button :onClick="() => commitWithdraw()">
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
  name: 'WithdrawAmountPopup',
  components: { Popup, Button, },
  props: ['visible', 'onCancel', 'onComplete',],
})
export default class WithdrawAmountPopup extends Vue {
  etherAmount = ''
  gweiPerByte = '200'
  prepayEtherFee = ''

  async commitWithdraw() {
    try {
      if (!this.$store.state.zkopru.wallet) {
        await this.$store.dispatch('loadWallet')
      }
      // generate an l2 tx
      const tx = await this.$store.state.zkopru.wallet.generateWithdrawal(
        this.$store.state.account.accounts[0],
        toWei(this.etherAmount),
        (+this.gweiPerByte * (10 ** 9)).toString(),
        toWei(this.prepayEtherFee || '0')
      )
      await this.$store.state.zkopru.wallet.wallet.sendTx({ tx })
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
