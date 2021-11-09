<template>
  <div class="container">
    <div class="popup" v-if="!sending">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div class="title-text">
          Confirm Transaction
        </div>
        <img
          :src="require('../../assets/close_icon.svg')"
          v-on:click="closeClicked"
          style="cursor: pointer; padding: 4px"
        />
      </div>
      <div spacer style="height: 22px" />
      <div
        class="line-item"
      >
        <div>Send</div>
        <div>{{ transferAmount }} {{activeToken.toUpperCase()}}</div>
      </div>
      <div
        class="line-item"
      >
        <div>To</div>
        <div style="max-width: 80%; overflow: auto; word-wrap: break-word;">{{ zkAddress }}</div>
      </div>
      <div
        class="line-item"
      >
        <div>Layer 2 Fee</div>
        <div>{{ feeAmount.toFixed(18) }} ETH</div>
      </div>
      <div
        class="line-item"
      >
        <div>Fiat Total</div>
        <div>~0.00 USD</div>
      </div>
      <NextButton
        text="Send"
        :onNext="() => send()"
      />
    </div>
    <div class="popup" v-show="sending" style="text-align: center;">
      <div spacer style="height: 47px" />
      <div class="title-text">
        Sending Transaction
      </div>
      <div spacer style="height: 32px" />
      <div class="detail-text">
        {{ sendMessages[currentMessageIndex] }}
      </div>
      <div spacer style="height: 24px" />
      <div ref="animationEl" style="margin: 0px -22px; width: calc(100% + 44px)" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import NextButton from './NextButton'
import { toWei, fromWei } from '../utils/wei'
import lottie from 'lottie-web'

@Component({
  name: 'ConfirmDepositPopup',
  components: { NextButton, },
  props: [
    'transferAmount',
    'activeToken',
    'feeAmount',
    'onClose',
    'zkAddress',
    'tx',
  ],
})
export default class ConfirmDepositPopup extends Vue {
  sending = false
  sendMessages = [
    'Calculating SNARK',
    'Broadcasting transaction',
  ]
  currentMessageIndex = 0

  mounted() {
    lottie.loadAnimation({
      container: this.$refs.animationEl,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../assets/loading_animation.json'),
    })
  }

  async send() {
    if (!this.tx) return
    this.sending = true
    try {
      this.currentMessageIndex = 0
      const zkTx = await this.$store.state.zkopru.wallet.wallet.shieldTx({
        tx: this.tx,
      })
      this.currentMessageIndex = 1
      await this.$store.state.zkopru.wallet.wallet.sendLayer2Tx(zkTx)
      await this.$store.dispatch('loadL2Balance')
      this.$router.push({ path: '/wallet' })
    } catch (err) {
      this.sending = false
      console.log(err)
    }
  }
  closeClicked() {
    if (typeof this.onClose === 'function') {
      this.onClose()
    }
  }
}
</script>
<style scoped>
.container {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: linear-gradient(323.78deg, rgba(0, 0, 0, 0.8) -10.87%, rgba(1, 18, 18, 0.8) 47.21%, rgba(0, 0, 0, 0.8) 101.17%, rgba(0, 0, 0, 0.8) 101.17%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup {
  border-radius: 8px;
  border: 1px solid #192C35;
  background-color: #05141A;
  max-width: 505px;
  width: 100vw;
  padding: 22px;
}
.line-item {
  padding: 16px 4px;
  font-size: 14px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 1px 0px #2A3D46;
  overflow: auto;
}
.title-text {
  color: #F2F2F2;
  font-size: 12px;
  font-weight: 600;
}
.detail-text {
  color: #95A7AE;
  font-size: 11px;
}
</style>
