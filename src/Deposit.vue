<template>
  <CenteredLeftMenu>
    <div spacer style="height: 70px" />
    <div eth v-if="depositType === 1 || depositType === 3" class="section-container">
      <div class="title-text" style="display: flex; align-items: center">
        <div style="display: flex; align-items: center">
          <div>Deposit</div>
          <div spacer style="width: 10px" />
          <img height="13px" :src="require('../assets/token_icons/ETH.svg')" />
        </div>
        <div spacer style="display: flex; flex: 1" />
        <InfoText
          :text="tooltips.DEPOSIT_ETH"
        />
      </div>
      <div spacer style="height: 23px" />
      <AssetDropdown
        activeAsset="ETH"
        :loadBalance="loadBalance.bind(this)"
        :editable="false"
        :showIcon="false"
      />
      <div spacer style="height: 16px" />
      <div style="flex: 1; max-width: 559px">
        <AssetAmountField
          asset="ETH"
          v-model="etherDepositAmount"
          :assetAmountState="etherAmountState"
          :buttons="['Max']"
          :buttonClicked="() => {
            const balance = $store.state.account.balance
            etherDepositAmount = isNaN(feeAmount) ? balance : Math.max(+balance - +feeAmount, 0)
          }"
        />
      </div>
    </div>
    <div eth v-if="depositType === 1 || depositType === 2" class="section-container">
      <div class="title-text" style="display: flex; align-items: center">
        <div style="display: flex; align-items: center">
          <div>Deposit</div>
          <div spacer style="width: 10px" />
          <img height="13px" :src="tryLoadAssetIcon(activeToken)" />
        </div>
        <div spacer style="display: flex; flex: 1" />
        <InfoText
          :text="depositType === 1 ? tooltips.DEPOSIT_ETH_TOKEN : tooltips.DEPOSIT_TOKEN"
        />
      </div>
      <div spacer style="height: 23px" />
      <AssetDropdown
        :activeAsset="activeToken"
        v-model="activeToken"
        :loadBalance="loadBalance.bind(this)"
        :showIcon="false"
        :tokenOnly="true"
      />
      <div v-if="activeToken" spacer style="height: 16px" />
      <div v-if="activeToken" style="flex: 1; max-width: 559px">
        <AssetAmountField
          :asset="activeToken"
          v-model="tokenDepositAmount"
          :assetAmountState="tokenAmountState"
          :buttons="['Max']"
          :buttonClicked="() => {
            const balance = $store.state.account.tokenBalances[activeToken]
            tokenDepositAmount = balance
          }"
        />
      </div>
    </div>
    <div class="section-container">
      <div style="display: flex; align-items: center">
        <div class="title-text">Coordinator Fee</div>
        <div style="display: flex; flex: 1" />
        <InfoText
          :text="tooltips.DEPOSIT_FEE"
        />
      </div>
      <div spacer style="height: 23px" />
      <div style="flex: 1; max-width: 559px">
        <AssetAmountField
          asset="ETH"
          v-model="feeAmount"
          :assetAmountState="feeAmountState"
          :buttons="['Fast', 'Standard']"
          :buttonClicked="setFeeAmount.bind(this)"
        />
      </div>
    </div>
    <div spacer style="height: 4px" />
    <NextButton
      :disabled="
        (depositType === 1 && (etherAmountState !== 1 || tokenAmountState !== 1 || feeAmountState !== 1)) ||
        (depositType === 2 && (tokenAmountState !== 1 || feeAmountState !== 1)) ||
        (depositType === 3 && (etherAmountState !== 1 || feeAmountState !== 1))
        "
      :onNext="() => showDeposit()"
      :onBack="() => $router.push(`/wallet/deposit/type?type=${depositType}`)"
    />
    <ConfirmDepositPopup
      v-if="showingDepositConfirm"
      :etherDepositAmount="etherDepositAmount"
      :tokenDepositAmount="tokenDepositAmount"
      :feeAmount="feeAmount"
      :activeToken="activeToken"
      :onClose="() => showingDepositConfirm = false"
    />
  </CenteredLeftMenu>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import AssetDropdown from './components/AssetDropdown'
import AssetAmountField from './components/AssetAmountField'
import { toWei, fromWei } from './utils/wei'
import Checkbox from './components/Checkbox'
import BN from 'bn.js'
import CenteredLeftMenu from './components/CenteredLeftMenu'
import NextButton from './components/NextButton'
import ConfirmDepositPopup from './components/ConfirmDepositPopup'
import measureText from './utils/measure-text'
import tooltips from './tooltips'
import InfoText from './components/InfoText'
import decimalCount from './utils/decimal-count'

@Component({
  name: 'Deposit',
  components: { AssetDropdown, AssetAmountField, Checkbox, NextButton, CenteredLeftMenu, ConfirmDepositPopup, InfoText, },
  watch: {
    etherDepositAmount() {
      this.updateEtherAmountState()
    },
    tokenDepositAmount() {
      this.updateTokenAmountState()
    },
    feeAmount() {
      this.updateEtherAmountState()
    },
  }
})
export default class Deposit extends Vue {
  tooltips = tooltips
  activeToken = ''
  etherAmountState = 0
  etherDepositAmount = '0'
  tokenAmountState = 0
  tokenDepositAmount = '0'
  feeAmount = '0'
  feeAmountState = 0
  depositType = 0
  showingDepositConfirm = false
  activeFeePromise = undefined

  mounted() {
    const { type, asset } = this.$route.query
    if (asset) {
      this.activeToken = asset.toUpperCase()
    }
    if (type && !isNaN(type)) {
      this.depositType = +type
    }
  }

  loadBalance(symbol) {
    if (symbol === 'ETH') {
      return `${this.$store.state.account.balance || '-'} | USD $-`
    }
    return `${this.$store.state.account.tokenBalances[symbol] || '0'} | USD $-`
  }

  async setFeeAmount(clickedButton) {
    const multiplier = clickedButton === 'Fast' ? new BN('200000') : new BN('100000')
    this.feeAmountState = 3
    let feePromise
    try {
      feePromise = this.$store.dispatch('loadCurrentWeiPerByte')
      this.activeFeePromise = feePromise
      const weiPerByte = await feePromise
      if (this.activeFeePromise !== feePromise) return
      this.activeFeePromise = undefined
      // Assume 2000 bytes for a simple deposit tx in a block
      const feeWeiAmount = new BN(weiPerByte.toString()).mul(multiplier)
      this.feeAmount = ''
      Vue.nextTick(() => {
        if (this.activeFeePromise !== undefined) return
        this.feeAmount = fromWei(feeWeiAmount, 9).toString()
      })
    } catch (err) {
      if (this.activeFeePromise === feePromise) this.activeFeePromise = undefined
      this.feeAmountState = 2
    }
  }

  showDeposit() {
    this.showingDepositConfirm = true
  }

  updateEtherAmountState() {
    if (this.feeAmount === '' || +this.feeAmount === 0) {
      this.feeAmountState = 0
    } else if (isNaN(this.feeAmount) || +this.feeAmount < 0) {
      this.feeAmountState = 2
    } else if (
      +this.feeAmount <= +this.$store.state.account.balance &&
      decimalCount(this.feeAmount) <= 18
    ) {
      this.feeAmountState = 1
    } else {
      this.feeAmountState = 2
    }
    if (this.etherDepositAmount === '') {
      this.etherAmountState = 0
    } else if (isNaN(this.etherDepositAmount) || +this.etherDepositAmount <= 0) {
      this.etherAmountState = 2
    } else if (
      +this.etherDepositAmount <= +this.$store.state.account.balance &&
      decimalCount(this.etherDepositAmount) <= 18
    ) {
      this.etherAmountState = 1
    } else {
      this.etherAmountState = 2
    }
    // check total amount if needed
    if (isNaN(this.feeAmount)) return
    if (isNaN(this.etherDepositAmount)) return
    if (isNaN(this.$store.state.account.balance)) return
    const total = +this.feeAmount + +this.etherDepositAmount
    if (total > +this.$store.state.account.balance) {
      this.feeAmountState = 2
      this.etherAmountState = 2
    }
  }

  updateTokenAmountState() {
    const token = this.$store.state.zkopru.registeredTokens.find(({ symbol }) => {
      return symbol === this.activeToken
    })
    if (!token) {
      this.tokenAmountState = 0
      return
    }
    if (this.tokenDepositAmount === '' || +this.tokenDepositAmount === 0) {
      this.tokenAmountState = 0
    } else if (isNaN(this.tokenDepositAmount) || +this.tokenDepositAmount <= 0) {
      this.tokenAmountState = 2
    } else if (
      +this.tokenDepositAmount <= +this.$store.state.account.tokenBalances[this.activeToken] &&
      decimalCount(this.tokenDepositAmount) <= token.decimals
    ) {
      this.tokenAmountState = 1
    } else {
      this.tokenAmountState = 2
    }
  }

  tryLoadAssetIcon(symbol) {
    try {
      return require(`../assets/token_icons/${symbol.toUpperCase()}.svg`)
    } catch (_) {
      return require('../assets/token_no_icon.png')
    }
  }
}
</script>
<style scoped>
.section-container {
  display: flex;
  flex-direction: column;
  max-width: 452px;
  width: 100vw;
  background-color: #081B24;
  border: 1px solid #2A3D46;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 16px;
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
