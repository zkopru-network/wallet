<template>
  <div class="container">
    <LeftMenu />
    <div style="display: flex; flex: 1; justify-content: center">
      <div container style="display: flex; flex-direction: column; align-items: center; font-size: 11px">
        <div spacer style="height: 70px" />
        <div class="section-container">
          <div class="title-text">Deposit</div>
          <div spacer style="height: 23px" />
          <AssetDropdown
            :activeAsset="activeAsset"
            v-model="activeAsset"
            :loadBalance="loadBalance.bind(this)"
          />
          <div spacer style="height: 55px" />
          <div style="flex: 1; max-width: 559px">
            <AssetAmountField
              :asset="activeAsset"
              v-model="depositAmount"
              :assetAmountState="amountState"
            />
          </div>
          <div spacer style="height: 13px" />
          <div class="detail-text">
            Current price for one Zkopru transaction is ~0.01 ETH.
          </div>
          <div spacer style="height: 20px" />
          <div v-if="activeAsset !== 'ETH' && +$store.state.zkopru.balance === 0" style="display: flex">
            <img :src="require('../assets/warning.svg')" />
            <div spacer style="width: 10px" />
            <div style="color: #F49F2F; font-size: 12px">
              You will need ETH in your wallet to send transactions with Zkopru
            </div>
          </div>
          <div v-if="activeAsset !== 'ETH'" spacer style="height: 20px" />
          <Checkbox
            v-if="activeAsset !== 'ETH'"
            style="align-self: flex-start"
            text="Add ETH to deposit"
            v-model="addEther"
            :checked="addEther"
          />
          <div v-if="addEther" style="flex: 1; max-width: 559px">
            <div spacer style="height: 31px" />
            <div style="display: flex; align-items: center">
              <div spacer style="width: 28px" />
              <img :src="require('../assets/token_icons/ETH.svg')" />
              <div spacer style="width: 26px" />
              <div style="color: #9EFFEE; font-size: 14px">ETH</div>
              <div spacer style="width: 5px" />
              <div style="color: white; font-size: 14px">{{loadBalance('ETH')}}</div>
            </div>
            <div spacer style="height: 31px" />
            <AssetAmountField
              asset="ETH"
              :assetAmountState="addEtherAmountState"
              v-model="addEtherAmount"
            />
          </div>

        </div>
        <div spacer style="height: 16px" />
        <div class="section-container">
          <div class="title-text">Coordinator Fee</div>
          <div spacer style="height: 23px" />
          <div style="flex: 1; max-width: 559px">
            <AssetAmountField
              asset="ETH"
              v-model="feeAmount"
              :assetAmountState="feeAmountState"
              :buttons="['Instant']"
              :buttonClicked="setFeeAmount.bind(this)"
            />
          </div>
          <div spacer style="height: 13px" />
          <div class="detail-text">
            Suggested fees are calculated based on current gas market.
          </div>
        </div>
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
import AssetDropdown from './components/AssetDropdown'
import AssetAmountField from './components/AssetAmountField'
import Button from './components/Button'
import { toWei, fromWei } from './utils/wei'
import Checkbox from './components/Checkbox'
import BN from 'bn.js'
import LeftMenu from './components/LeftMenu'

@Component({
  name: 'Deposit',
  components: { AssetDropdown, AssetAmountField, Button, Checkbox, LeftMenu, },
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
    },
    feeAmount() {
      if (this.feeAmount === '') {
        this.feeAmountState = 0
      } else if (isNaN(this.feeAmount)) {
        this.feeAmountState = 2
      } else if (+this.feeAmount > 0) {
        this.feeAmountState = 1
      } else {
        this.feeAmountState = 2
      }
    },
    addEtherAmount() {
      if (this.depositAmount === '') {
        this.addEtherAmountState = 0
      } else if (isNaN(this.depositAmount)) {
        this.addEtherAmountState = 2
      } else {
        this.addEtherAmountState = +this.depositAmount > this.$store.state.account.balance ? 2 : 1
      }
    },
    activeAsset(newVal, oldVal) {
      if (newVal === 'ETH' || oldVal === 'ETH') {
        this.addEther = false
        this.addEtherAmount = '0'
        this.addEtherAmountState = 0
      }
    }
  }
})
export default class Deposit extends Vue {
  activeAsset = 'ETH'
  addEther = false
  addEtherAmount = '0'
  addEtherAmountState = 0
  amountState = 0
  depositAmount = '0'
  feeAmount = '0'
  feeAmountState = 0

  mounted() {
    if (this.$route.query.asset) {
      this.activeAsset = this.$route.query.asset.toUpperCase()
    }
  }

  loadBalance(symbol) {
    if (symbol === 'ETH') {
      return `${this.$store.state.account.balance || '-'} | USD $-`
    }
    return `${this.$store.state.account.tokenBalances[symbol] || '0'} | USD $-`
  }

  async setFeeAmount(clickedButton) {
    if (clickedButton === 'Instant') {
      this.feeAmountState = 3
      try {
        const weiPerByte = await this.$store.dispatch('loadCurrentWeiPerByte')
        // Assume 2000 bytes for a simple deposit tx in a block
        const feeWeiAmount = new BN(weiPerByte).mul(new BN('200000'))
        this.feeAmount = ''
        Vue.nextTick(() => {
          this.feeAmount = fromWei(feeWeiAmount, 9).toString()
        })
      } catch (err) {
        this.feeAmountState = 2
      }
    }
  }

  async deposit() {
    if (this.activeAsset === 'ETH' && this.amountState === 1) {
      const { to, data, value, onComplete } = this.$store.state.zkopru.wallet.wallet.depositEtherTx(
        toWei(this.depositAmount),
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
      const token = this.$store.state.zkopru.registeredTokens.find(({ symbol }) => symbol === this.activeAsset)
      const amountDecimals = `${(+this.depositAmount)*(10**(+token.decimals))}`
      const { to, data, value, onComplete } = this.$store.state.zkopru.wallet.wallet.depositERC20Tx(
        this.addEther ? toWei(this.addEtherAmount) : toWei(0),
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
    this.$router.push({ path: '/wallet' })
  }
}
</script>
<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #05141A;
}
.section-container {
  display: flex;
  flex-direction: column;
  max-width: 452px;
  width: 100vw;
  background-color: #192C35;
  border-radius: 8px;
  padding: 16px;
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
