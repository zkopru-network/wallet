<template>
  <div class="container">
    <Header showBackButton=true prevPath="/wallet" />
    <div spacer style="height: 44px" />
    <div container style="display: flex; flex-direction: column; align-items: center; font-size: 12px">
      <div class="section-container">
        <div>
          Withdraw
        </div>
        <div spacer style="height: 23px" />
        <AssetDropdown
          :activeAsset="activeAsset"
          v-model="activeAsset"
        />
        <div spacer style="height: 27px" />
        <AssetAmountField
          :asset="activeAsset"
          v-model="withdrawAmount"
          :assetAmountState="amountState"
        />
        <div spacer style="height: 18px" />
        <div class="small-text">
          Withdrawals take ~7 days
        </div>
        <div spacer style="height: 18px" />
        <div style="align-self: flex-start">
          <Checkbox
            v-model="useInstantWithdraw"
            :checked="useInstantWithdraw"
            text="Use instant withdraw"
          />
        </div>
      </div>
      <div spacer v-if="useInstantWithdraw" style="height: 16px" />
      <div v-if="useInstantWithdraw" class="section-container">
        <div style="display: flex; align-items: center">
          <img :src="require('../assets/lightning_bolt.svg')" />
          <div spacer style="width: 17px" />
          <div>Instant withdraw fee</div>
        </div>
        <div spacer style="height: 27px" />
        <AssetAmountField
          asset="ETH"
          v-model="instantWithdrawFee"
          :assetAmountState="instantWithdrawFeeState"
        />
      </div>
      <div spacer style="height: 16px" />
      <div class="section-container">
        <div style="display: flex; flex-direction: column; justify-content: center">
          <div>Transaction fee per byte</div>
          <div spacer style="height: 20px" />
          <FeeField
            v-model="fee"
          />
          <div spacer style="height: 10px" />
          <div class="small-text">
            Suggested fee is calculated based on the current gas market.
          </div>
        </div>
      </div>
      <div container style="display: flex; justify-content: center; flex: 1; width: 100vw; align-self: center; font-size: 12px">
        <div style="flex: 1; max-width: 452px">
          <div spacer style="height: 37px" />
          <div style="display: flex; justify-content: space-between; color: white; border-bottom: 0.5px solid #2a3d46; padding-bottom: 5px">
            <div style="display: flex; flex-direction: column">
              <div>Withdraw Total</div>
              <div>Fee Total</div>
            </div>
            <div style="display: flex; flex-direction: column">
              <div>{{withdrawAmount || '0'}} {{activeAsset}}</div>
              <div>{{totalFee}} ETH</div>
            </div>
          </div>
          <div spacer style="height: 45px" />
          <Button buttonStyle="background: #00FFD1; color: #0E2936" :onClick="() => sendTx()">
            WITHDRAW
          </Button>
          <div spacer style="height: 39px" />
          <div style="display: flex; justify-content: center">
            <div
              style="font-weight: bold; font-size: 14px; text-decoration: underline; cursor: pointer"
              v-on:click="$router.push({ path: '/wallet' })"
            >
              Cancel
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Header from './components/Header'
import AssetDropdown from './components/AssetDropdown'
import FeeField from './components/FeeField'
import AssetAmountField from './components/AssetAmountField'
import Button from './components/Button'
import Checkbox from './components/Checkbox'
import { toWei, fromWei } from './utils/wei'
import BN from 'bn.js'

@Component({
  name: 'Withdraw',
  components: { Header, AssetDropdown, Button, FeeField, AssetAmountField, Checkbox, },
  watch: {
    withdrawAmount() {
      this.generateTx()
      if (this.withdrawAmount === '') {
        this.amountState = 0
      } else if (isNaN(this.withdrawAmount)) {
        this.amountState = 2
      } else if (this.activeAsset === 'ETH') {
        this.amountState = +this.withdrawAmount > this.$store.state.zkopru.balance ? 2 : 1
      } else {
        this.amountState = 0
      }
    },
    instantWithdrawFee() {
      if (this.instantWithdrawFee === '') {
        this.instantWithdrawFeeState = 0
      } else if (isNaN(this.instantWithdrawFee)) {
        this.instantWithdrawFeeState = 2
      } else if (+this.instantWithdrawFee > this.$store.state.zkopru.balance) {
        this.instantWithdrawFeeState = 2
      } else {
        this.instantWithdrawFeeState = 1
      }
    },
    zkAddress() {
      this.generateTx()
    },
    fee() {
      this.generateTx()
    },
    activeAsset(newVal, oldVal) {
      if (newVal === oldVal) return
      this.withdrawAmount = '0'
      this.fee = '200'
      this.instantWithdrawFee = ''
    }
  }
})
export default class Withdraw extends Vue {
  activeAsset = 'ETH'
  withdrawAmount = '0'
  amountState = 0
  fee = '200'
  totalFee = '-'
  tx = undefined
  useInstantWithdraw = false
  instantWithdrawFee = ''
  instantWithdrawFeeState = 0

  async generateTx() {
    if (
      !this.fee ||
      !this.withdrawAmount
    ) {
      this.totalFee = '-'
      this.tx = undefined
      return
    }
    const tx = await this.$store.state.zkopru.wallet.generateWithdrawal(
      this.$store.state.account.accounts[0],
      toWei(this.withdrawAmount),
      (+this.fee * (10 ** 9)).toString(),
      toWei(this.instantWithdrawFee || '0')
    )
    this.totalFee = fromWei(tx.fee.toString(), 8)
    this.totalEther = fromWei(new BN(tx.fee)
      .add(new BN(toWei(this.withdrawAmount)))
      .add(new BN(toWei(this.instantWithdrawFee || '0')))
      .toString())
    this.tx = tx
  }

  async sendTx() {
    if (!this.tx) return
    await this.$store.state.zkopru.wallet.wallet.sendTx({
      tx: this.tx,
    })
    await this.$store.dispatch('loadL2Balance')
    this.$route.push({ path: '/wallet' })
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
  color: white;
}
.section-container {
  display: flex;
  flex-direction: column;
  max-width: 452px;
  width: 100vw;
  background-color: #192C35;
  border-radius: 8px;
  padding: 16px;
  font-size: 11px;
}
</style>
