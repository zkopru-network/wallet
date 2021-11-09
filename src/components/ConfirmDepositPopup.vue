<template>
  <div class="container">
    <div class="popup" v-if="depositState < 2">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div class="title-text">
          Confirm Deposit
        </div>
        <img
          :src="require('../../assets/close_icon.svg')"
          v-on:click="closeClicked"
          style="cursor: pointer; padding: 4px"
        />
      </div>
      <div spacer style="height: 22px" />
      <div
        v-if="!isNaN(etherDepositAmount)"
        class="line-item"
      >
        <div>Deposit</div>
        <div>{{ etherDepositAmount }} ETH</div>
      </div>
      <div
        v-if="activeToken"
        class="line-item"
      >
        <div>Deposit</div>
        <div>{{ tokenDepositAmount }} {{activeToken.toUpperCase()}}</div>
      </div>
      <div
        class="line-item"
      >
        <div>Layer 2 Fee</div>
        <div>{{ feeAmount }} ETH</div>
      </div>
      <div
        class="line-item"
      >
        <div>Fiat Total</div>
        <div>~0.00 USD</div>
      </div>
      <div v-if="depositState === 0" class="detail-text" style="margin-top: 24px">
        By clicking approve you consent to Zkopru sending tokens to your Zkopru wallet on your behalf.
      </div>
      <NextButton
        v-if="depositState === 0"
        text="Approve"
        :onNext="() => approve()"
      />
      <NextButton
        v-if="depositState === 1"
        text="Confirm"
        :onNext="() => deposit()"
      />
    </div>
    <div class="popup" v-if="depositState === 2" style="text-align: center;">
      <div spacer style="height: 47px" />
      <div class="title-text">
        Approving Spend Amount
      </div>
      <div spacer style="height: 32px" />
      <div class="detail-text">
        Please wait for confirmation.
      </div>
      <div spacer style="height: 24px" />
      <img
        :src="require('../../assets/deposit_loading_image.png')"
        style="width: 100%"
      />
    </div>
    <div class="popup" v-if="depositState === 3" style="text-align: center;">
      <div spacer style="height: 47px" />
      <div class="title-text">
        Spend Amount Approved
      </div>
      <div spacer style="height: 32px" />
      <div class="detail-text">
        Please confirm the transaction to complete your deposit.
      </div>
      <div spacer style="height: 24px" />
      <img
        :src="require('../../assets/deposit_loading_image.png')"
        style="width: 100%"
      />
    </div>
    <div class="popup" v-show="depositState === 4" style="text-align: center;">
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <img
          :src="require('../../assets/close_icon.svg')"
          v-on:click="closeClicked"
          style="cursor: pointer; padding: 4px"
        />
      </div>
      <div spacer style="height: 34px" />
      <div class="title-text">
        Confirming Deposit
      </div>
      <div spacer style="height: 32px" />
      <div class="detail-text">
        Closing this window will NOT interrupt the deposit.
      </div>
      <div spacer style="height: 24px" />
      <div ref="animationEl" style="margin: 0px -22px; width: calc(100% + 44px)" />
      <NextButton
        text="See Transaction History"
        :onNext="() => $router.push('/wallet/history')"
      />
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
    'etherDepositAmount',
    'tokenDepositAmount',
    'activeToken',
    'feeAmount',
    'onClose',
  ],
})
export default class ConfirmDepositPopup extends Vue {
  // possible states
  // 0 - showing button to set spending approval for token
  // 1 - showing button to deposit ether
  // 2 - waiting for token approval to complete
  // 3 - showing metamask popup for deposit tx
  // 4 - waiting for deposit tx to complete
  depositState = 0
  mounted() {
    // if (!isNaN(this.tokenDepositAmount) && +this.tokenDepositAmount > 0) {
    if (this.activeToken) {
      this.depositState = 0
    } else {
      this.depositState = 1
    }
    lottie.loadAnimation({
      container: this.$refs.animationEl,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../assets/loading_animation.json'),
    })
  }

  async approve() {
    const token = this.$store.state.zkopru.registeredTokens.find(({ symbol }) => symbol === this.activeToken)
    const amountDecimals = `${(+this.tokenDepositAmount)*(10**(+token.decimals))}`
    const { to, data, value, onComplete } = this.$store.state.zkopru.wallet.wallet.depositERC20Tx(
      toWei(this.etherDepositAmount),
      token.address,
      amountDecimals,
      toWei(this.feeAmount),
    )
    const tokenContract = await this.$store.state.zkopru.client.getERC20Contract(token.address)
    const transferData = tokenContract.methods.approve(to, amountDecimals).encodeABI()
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [{
        data: transferData,
        to: token.address,
        value: '0',
        from: this.$store.state.account.accounts[0],
      }]
    })
    this.depositState = 2
    // TODO: watch tx/poll for approval
    setTimeout(() => {
      this.depositState = 3
      this.deposit()
    }, 30000)
  }

  async deposit() {
    if (!this.activeToken) {
      const { to, data, value, onComplete } = this.$store.state.zkopru.wallet.wallet.depositEtherTx(
        toWei(this.etherDepositAmount),
        toWei(this.feeAmount),
      )
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          data,
          to,
          value,
          from: this.$store.state.account.accounts[0],
        }]
      })
      await onComplete()
      await this.$store.dispatch('loadL2Balance')
    } else {
      const token = this.$store.state.zkopru.registeredTokens.find(({ symbol }) => symbol === this.activeToken)
      const amountDecimals = `${(+this.tokenDepositAmount)*(10**(+token.decimals))}`
      const { to, data, value, onComplete } = this.$store.state.zkopru.wallet.wallet.depositERC20Tx(
        toWei(this.etherDepositAmount),
        token.address,
        amountDecimals,
        toWei(this.feeAmount),
      )
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          data,
          to,
          value,
          from: this.$store.state.account.accounts[0],
        }]
      })
      await onComplete()
      await this.$store.dispatch('loadL2Balance')
    }
    this.depositState = 4
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
