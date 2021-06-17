<template>
  <div class="container">
    <Header showBackButton=true prevPath="/wallet" />
    <div spacer style="height: 44px" />
    <AssetDropdown
      :activeAsset="activeAsset"
      v-model="activeAsset"
      :loadBalance="loadBalance.bind(this)"
    />
    <div spacer style="height: 55px" />
    <div container style="display: flex; justify-content: center; flex: 1; width: 100vw; align-self: center; font-size: 12px">
      <div style="flex: 1; max-width: 559px">
        <AssetAmountField
          :asset="activeAsset"
          v-model="depositAmount"
          :assetAmountState="amountState"
        />
        <div spacer style="height: 20px" />
        <Button
          :onClick="deposit.bind(this)"
          buttonStyle="background: #00FFD1; color: #0E2936"
        >
          Deposit
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Header from './components/Header'
import AssetDropdown from './components/AssetDropdown'
import AssetAmountField from './components/AssetAmountField'
import Button from './components/Button'
import { toWei } from './utils/wei'

@Component({
  name: 'Deposit',
  components: { Header, AssetDropdown, AssetAmountField, Button, },
  watch: {
    depositAmount() {
      if (this.depositAmount === '') {
        this.amountState = 0
      } else if (isNaN(this.depositAmount)) {
        this.amountState = 2
      } else if (this.activeAsset === 'ETH') {
        this.amountState = +this.depositAmount > this.$store.state.account.balance ? 2 : 1
      } else {
        this.amountState = 0
      }
    }
  }
})
export default class Deposit extends Vue {
  activeAsset = 'ETH'
  amountState = 0
  depositAmount = ''

  mounted() {
    if (this.$route.query.asset) {
      this.activeAsset = this.$route.query.asset.toUpperCase()
    }
  }

  loadBalance(symbol) {
    if (symbol === 'ETH') {
      return `${this.$store.state.account.balance || '-'} | USD $-`
    }
    return `0 | USD $-`
  }

  async deposit() {
    if (this.activeAsset === 'ETH' && this.amountState === 1) {
      const { to, data, value, onComplete } = this.$store.state.zkopru.wallet.wallet.depositEtherTx(
        toWei(this.depositAmount),
        toWei('0.01'),
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
  }
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 8px;
  padding-right: 8px;
  color: #95A7AE;
}
</style>
