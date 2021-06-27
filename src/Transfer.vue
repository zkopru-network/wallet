<template>
  <div class="container">
    <Header showBackButton=true prevPath="/wallet" />
    <div spacer style="height: 44px" />
    <div container style="display: flex; flex-direction: column; align-items: center; font-size: 12px">
      <div class="section-container">
        <div>
          Send
        </div>
        <div spacer style="height: 23px" />
        <AssetDropdown
          :activeAsset="activeAsset"
          v-model="activeAsset"
        />
        <div spacer style="height: 27px" />
        <AssetAmountField
          :asset="activeAsset"
          v-model="transferAmount"
          :assetAmountState="amountState"
        />
        <div spacer style="height: 42px" />
        <div>
          to Zkopru address
        </div>
        <div spacer style="height: 21px" />
        <AddressField
          v-model="zkAddress"
          :address="zkAddress"
        />
      </div>
      <div spacer style="height: 32px" />
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
              <div>Transaction Total</div>
              <div>Fee Total</div>
            </div>
            <div style="display: flex; flex-direction: column">
              <div>{{transferAmount || '0'}} {{activeAsset}}</div>
              <div>{{totalFee}} ETH</div>
            </div>
          </div>
          <div spacer style="height: 45px" />
          <Button buttonStyle="background: #00FFD1; color: #0E2936" :onClick="() => sendTx()">
            SEND
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
import Button from './components/Button'
import AddressField from './components/AddressField'
import FeeField from './components/FeeField'
import AssetAmountField from './components/AssetAmountField'
import { toWei, fromWei } from './utils/wei'
import BN from 'bn.js'

@Component({
  name: 'Transfer',
  components: { Header, AssetDropdown, Button, AddressField, FeeField, AssetAmountField, },
  watch: {
    transferAmount() {
      this.generateTx()
      if (this.transferAmount === '') {
        this.amountState = 0
      } else if (isNaN(this.transferAmount)) {
        this.amountState = 2
      } else if (this.activeAsset === 'ETH') {
        this.amountState = +this.transferAmount > this.$store.state.zkopru.balance ? 2 : 1
      } else {
        this.amountState = 0
      }
    },
    zkAddress() {
      this.generateTx()
    },
    fee() {
      this.generateTx()
    }
  },
})
export default class Transfer extends Vue {
  activeAsset = 'ETH'
  transferAmount = '0'
  amountState = 0
  zkAddress = ''
  fee = '200'
  totalFee = '-'
  tx = undefined

  mounted() {
    if (this.$route.query.asset) {
      this.activeAsset = this.$route.query.asset.toUpperCase()
    }
  }

  paramString() {
    return `${this.zkAddress}-${this.fee}-${this.transferAmount}`
  }

  async generateTx() {
    if (
      !this.zkAddress ||
      !this.fee ||
      !this.transferAmount
    ) {
      this.totalFee = '-'
      this.tx = undefined
      return
    }
    const params = this.paramString()
    const tx = await this.$store.state.zkopru.wallet.generateEtherTransfer(
      this.zkAddress,
      toWei(this.transferAmount),
      (+this.fee * (10 ** 9)).toString()
    )
    // params changed during tx calc
    if (this.paramString() !== params) return

    this.totalFee = fromWei(tx.fee.toString(), 8)
    this.totalEther = fromWei(new BN(tx.fee).add(new BN(toWei(this.transferAmount))).toString())
    this.tx = tx
  }

  async sendTx() {
    if (!this.tx) return
    await this.$store.state.zkopru.wallet.wallet.sendTx({
      tx: this.tx,
      encryptTo: this.zkAddress,
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
  font-size: 12px;
}
.small-text {
  font-size: 12px;
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
</style>
