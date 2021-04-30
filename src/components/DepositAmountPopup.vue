<template>
  <Popup :visible="visible" :onCancel="onCancel">
    <div class="popup-title">
      Deposit Ether
    </div>
    <input type="text" v-model="etherAmount" /> Ether
    <Button :onClick="() => commitDeposit()">
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
  name: 'DepositAmountPopup',
  components: { Popup, Button, },
  props: ['visible', 'onCancel', 'onComplete'],
})
export default class DepositAmountPopup extends Vue {
  etherAmount = ''

  async commitDeposit() {
    try {
      if (!this.$store.state.zkopru.wallet) {
        await this.$store.dispatch('loadWallet')
      }
      const { to, data, value, onComplete } = this.$store.state.zkopru.wallet.wallet.depositEtherTx(
        toWei(this.etherAmount),
        toWei('0.01'),
      )
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          data,
          value,
          to,
          value,
          from: this.$store.state.account.accounts[0],
        }]
      })
      await onComplete()
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
