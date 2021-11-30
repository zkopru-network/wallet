<template>
  <div class="popup-container" v-on:click="cancel">
    <div v-if="addState === 0" class="popup" v-on:click="captureClick">
      <div class="title-text">
        Register Token
      </div>
      <div spacer style="height: 22px" />
      <input
        class="token-address-field"
        placeholder="Enter Token Address"
        v-model="tokenAddress"
        :style="`
          ${tokenAddressValid ? 'border-color: #00FFD1' : ''}
        `"
      />
      <NextButton :onNext="loadTokenInfo.bind(this)" />
    </div>
    <div v-if="addState === 1 || addState === 2 || addState === 4" class="popup" v-on:click="captureClick">
      <div class="title-text">
        {{ addState === 1 ? 'Confirm Token Deposit' : 'Review Registered Token' }}
      </div>
      <div v-if="addState === 4" style="display: flex; align-items: center; padding-top: 24px">
        <img :src="require('../../assets/warning.svg')" />
        <div spacer style="width: 11px" />
        <div style="color: #F49F2F">This token has already been registered</div>
      </div>
      <div spacer style="height: 22px" />
      <div class="line-item">
        <div>Symbol</div>
        <div>{{tokenInfo.symbol}}</div>
      </div>
      <div class="line-item">
        <div>Icon</div>
        <img :src="tryLoadAssetIcon(tokenInfo.symbol)" />
      </div>
      <div class="line-item">
        <div>Name</div>
        <div>{{tokenInfo.name}}</div>
      </div>
      <div class="line-item">
        <div>Decimal Places</div>
        <div>{{tokenInfo.decimals}}</div>
      </div>
      <NextButton v-if="addState === 1" text="Register" :onNext="registerToken.bind(this)" />
      <NextButton v-if="addState === 2" text="View on Etherscan" :onNext="viewTx.bind(this)" />
    </div>
    <div v-if="addState === 3" class="popup" v-on:click="captureClick">
      <div class="title-text">
        Register Token
      </div>
      <div style="display: flex; align-items: center; padding: 24px 0px">
        <img :src="require('../../assets/warning.svg')" />
        <div spacer style="width: 11px" />
        <div style="color: #F49F2F">Failed to fetch ERC-20 data</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import NextButton from './NextButton'
import { tryLoadAssetIcon } from '../utils/token'

@Component({
  name: 'AddTokenPopup',
  components: { NextButton, },
  props: ['onCancel'],
  watch: {
    tokenAddress() {
      this.tokenAddressValid = /^(0x)?[a-fA-F0-9]{40}$/.test(this.tokenAddress)
    }
  }
})
export default class AddTokenPopup extends Vue {
  tryLoadAssetIcon = tryLoadAssetIcon

  addState = 0
  tokenAddress = ''
  tokenAddressValid = false
  tokenInfo = {}
  txHash = ''

  cancel() {
    if (typeof this.onCancel === 'function') {
      this.onCancel()
    }
  }

  captureClick(e) {
    e.stopPropagation()
  }

  async loadTokenInfo() {
    if (!this.tokenAddressValid) return
    // load the info
    try {
      const tokenContract = await this.$store.state.zkopru.client.getERC20Contract(this.tokenAddress)
      const [ decimals, symbol, name ] = await Promise.all([
        tokenContract.methods.decimals().call(),
        tokenContract.methods.symbol().call(),
        tokenContract.methods.name().call(),
      ])
      this.tokenInfo = { decimals, symbol, name }
      if (this.$store.state.zkopru.tokensByAddress[this.tokenAddress]) {
        this.addState = 4
        return
      }
      this.addState = 1
    } catch (err) {
      console.log(err)
      this.addState = 3
    }
  }

  async registerToken() {
    this.txHash = await this.$store.dispatch('registerERC20', this.tokenAddress)
    this.addState = 2
  }

  async viewTx() {
    window.open(`https://goerli.etherscan.io/tx/${this.txHash}`, '_blank')
  }
}
</script>

<style scoped>
.popup-container {
  position: fixed;
  top: 0px;
  left: 200px;
  right: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  padding-top: 117px;
  background-color: rgba(0,0,0,0.6);
}
.popup {
  border-radius: 8px;
  border: 1px solid #192C35;
  background-color: #05141A;
  max-width: 505px;
  width: 100vw;
  padding: 22px;
  /* margin-top: 20%; */
}
.title-text {
  color: #F2F2F2;
  font-size: 12px;
  font-weight: 600;
}
.token-address-field {
  border: 0px;
  background: #05141A;
  color: white;
  font-family: Inter;
  font-size: 14px;
  padding: 10px;
  width: calc(100% - 20px);
  border: 1px solid #2A3D46;
  border-radius: 8px;
}
.token-address-field::placeholder {
  font-size: 14px;
  color: #95A7AE;
}
.token-address-field:focus {
  outline: 0px;
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
</style>
