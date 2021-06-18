<template>
  <div class="container">
    <Header showBackButton=true prevPath="/wallet" />
    <div spacer style="height: 44px" />
    <AssetDropdown
      :activeAsset="activeAsset"
      v-model="activeAsset"
    />
    <div container style="display: flex; justify-content: center; flex: 1; width: 100vw; align-self: center; font-size: 12px">
      <div style="flex: 1; max-width: 559px">
        <div spacer style="height: 55px" />
        <div>
          Send
        </div>
        <div spacer style="height: 20px" />
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
          v-model="addressInfo"
          :addressInfo="addressInfo"
        />
        <div spacer style="height: 2px" />
        <div class="small-text">
          {{addressInfo.aliased && addressInfo.zkAddress || ''}}
        </div>
        <div spacer style="height: 32px" />
        <div style="display: flex; flex-direction: column; justify-content: center">
          <div>Transaction fee per byte</div>
          <div spacer style="height: 20px" />
          <FeeField
          />
          <div spacer style="height: 10px" />
          <div class="small-text">
            Suggested fee is calculated based on the current gas market.
          </div>
        </div>
        <div spacer style="height: 39px" />
        <Button buttonStyle="background: #00FFD1; color: #0E2936">
          SEND
        </Button>
        <div spacer style="height: 37px" />
        <div style="display: flex; justify-content: space-between; color: white; border-bottom: 0.5px solid #2a3d46; padding-bottom: 5px">
          <div style="display: flex; flex-direction: column">
            <div>Transaction Total</div>
            <div>Fee Total</div>
          </div>
          <div style="display: flex; flex-direction: column">
            <div>0 {{activeAsset}}</div>
            <div>0 ETH</div>
          </div>
        </div>
        <div spacer style="height: 45px" />
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

@Component({
  name: 'Transfer',
  components: { Header, AssetDropdown, Button, AddressField, FeeField, AssetAmountField, },
  watch: {
    transferAmount() {
      if (this.transferAmount === '') {
        this.amountState = 0
      } else if (isNaN(this.transferAmount)) {
        this.amountState = 2
      } else if (this.activeAsset === 'ETH') {
        this.amountState = +this.transferAmount > this.$store.state.zkopru.balance ? 2 : 1
      } else {
        this.amountState = 0
      }
    }
  }
})
export default class Transfer extends Vue {
  activeAsset = 'ETH'
  transferAmount = ''
  amountState = 0
  addressInfo = {
    zkAddress: '',
    aliased: false,
  }
  mounted() {
    if (this.$route.query.asset) {
      this.activeAsset = this.$route.query.asset.toUpperCase()
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
.small-text {
  font-size: 9px;
}
</style>
