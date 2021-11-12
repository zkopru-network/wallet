<template>
  <CenteredLeftMenu>
    <div spacer style="height: 70px" />
    <div class="section-container">
      <div class="title-text" style="display: flex; align-items: center">
        <div style="display: flex">
          <div>Withdraw</div>
          <div spacer style="width: 10px" />
          <img height="13px" v-if="!!activeAsset" :src="tryLoadAssetIcon(activeAsset)" />
        </div>
        <div spacer style="flex: 1" />
        <InfoText
          :text="tooltips.WITHDRAW_ASSET"
        />
      </div>
      <div spacer style="height: 23px" />
      <AssetDropdown
        :activeAsset="activeAsset"
        v-model="activeAsset"
        :showIcon="false"
      />
      <div v-if="activeAsset" spacer style="height: 16px" />
      <div v-if="activeAsset" style="flex: 1; max-width: 559px">
        <AssetAmountField
          :asset="activeAsset"
          v-model="withdrawAmount"
          :assetAmountState="amountState"
          :buttons="['Max']"
          :buttonClicked="() => {
            if (activeAsset === 'ETH' && $store.state.zkopru.balance) {
              withdrawAmount = $store.state.zkopru.balance
            } else if ($store.state.zkopru.tokenBalances[activeAsset]) {
              withdrawAmount = $store.state.zkopru.tokenBalance[activeAsset]
            }
          }"
        />
      </div>
    </div>
    <div v-if="withdrawType === 2" class="section-container">
      <div style="display: flex; align-items: center">
        <div style="display: flex">
          <div class="title-text">Instant Withdraw Fee</div>
          <div spacer style="width: 10px" />
          <img height="13px" v-if="!!activeAsset" :src="tryLoadAssetIcon(activeAsset)" />
        </div>
        <div spacer style="flex: 1" />
        <InfoText
          :text="tooltips.WITHDRAW_INSTANT_FEE"
        />
      </div>
      <div spacer style="height: 27px" />
      <AssetAmountField
        asset="ETH"
        v-model="instantWithdrawFee"
        :assetAmountState="instantWithdrawFeeState"
      />
    </div>
    <div class="section-container">
      <div style="display: flex; align-items: center">
        <div class="title-text">Network Fee in GWEI</div>
        <div spacer style="flex: 1" />
        <InfoText
          :text="tooltips.WITHDRAW_FEE"
        />
      </div>
      <div spacer style="height: 20px" />
      <div style="flex: 1; max-width: 559px">
        <AssetAmountField
          v-model="feeAmount"
          :assetAmountState="feeAmountState"
          asset="ETH"
          :buttons="['Fast', 'Standard']"
          :buttonClicked="suggestedFee.bind(this)"
        />
      </div>
    </div>
    <NextButton
      :disabled="
        (withdrawType === 1 && (amountState !== 1 || feeAmountState !== 1)) ||
        (withdrawType === 2 && (amountState !== 1 || feeAmountState !== 1 || instantWithdrawFeeState !== 1))
      "
      :onNext="() => showWithdraw()"
      :onBack="() => $router.push(`/wallet/withdraw/type?type=${withdrawType}`)"
    />
    <ConfirmWithdrawPopup
      v-if="showingWithdrawConfirm"
      :withdrawAmount="withdrawAmount"
      :activeAsset="activeAsset"
      :feeAmount="feeAmount"
      :instantWithdrawFee="instantWithdrawFee"
      :withdrawType="withdrawType"
      :tx="tx"
      :onClose="() => showingWithdrawConfirm = false"
    />
  </CenteredLeftMenu>
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
import CenteredLeftMenu from './components/CenteredLeftMenu'
import NextButton from './components/NextButton'
import ConfirmWithdrawPopup from './components/ConfirmWithdrawPopup'
import InfoText from './components/InfoText'
import tooltips from './tooltips'
import decimalCount from './utils/decimal-count'

@Component({
  name: 'Withdraw',
  components: { Header, AssetDropdown, Button, FeeField, AssetAmountField, Checkbox, CenteredLeftMenu, NextButton, ConfirmWithdrawPopup, InfoText, },
  watch: {
    withdrawAmount() {
      this.generateTx()
      this.validateWithdrawAmount()
    },
    instantWithdrawFee() {
      this.validateInstantWithdrawFee()
    },
    feeAmount() {
      this.generateTx()
      this.feeAmountState = 1
    },
    activeAsset(newVal, oldVal) {
      if (newVal === oldVal) return
      this.withdrawAmount = '0'
    }
  },
  computed: {
    totalEthFee() {
      let total = 0
      if (this.withdrawType === 2) {
        total += +this.instantWithdrawFee
      }
      if (!isNaN(this.totalFee)) {
        total += this.totalFee
      }
      return total
    }
  }
})
export default class Withdraw extends Vue {
  tooltips = tooltips
  activeAsset = 'ETH'
  withdrawAmount = '0'
  amountState = 0
  feeAmount = '0'
  feeAmountState = 0
  totalFee = '-'
  tx = undefined
  instantWithdrawFee = '0'
  instantWithdrawFeeState = 0
  withdrawType = 0
  showingWithdrawConfirm = false

  mounted() {
    const { type, asset } = this.$route.query
    if (asset) {
      this.activeAsset = asset.toUpperCase()
    }
    if (type && !isNaN(type)) {
      this.withdrawType = +type
    }
  }

  showWithdraw() {
    this.showingWithdrawConfirm = true
  }

  async suggestedFee(clickedButton) {
    if (clickedButton === 'Standard') {
      try {
        this.feeAmountState = 3
        const weiPerByte = await this.$store.dispatch('loadCurrentWeiPerByte')
        this.feeAmount = (+weiPerByte / (10**9)).toString()
      } catch (err) {
        this.feeAmountState = 2
      }
    }
    if (clickedButton === 'Fast') {
      try {
        this.feeAmountState = 3
        const weiPerByte = await this.$store.dispatch('loadCurrentWeiPerByte')
        this.feeAmount = (2 * +weiPerByte / (10**9)).toString()
      } catch (err) {
        this.feeAmountState = 2
      }
    }
  }

  async generateTx() {
    if (
      !this.feeAmount ||
      !this.withdrawAmount
    ) {
      this.totalFee = '-'
      this.tx = undefined
      return
    }
    if (this.activeAsset === 'ETH') {
      const tx = await this.$store.state.zkopru.wallet.generateWithdrawal(
        this.$store.state.account.accounts[0],
        toWei(this.withdrawAmount),
        (+this.feeAmount * (10 ** 9)).toString(),
        toWei(this.instantWithdrawFee || '0')
      )
      this.totalFee = fromWei(tx.fee.toString(), 8)
      this.totalEther = fromWei(new BN(tx.fee)
        .add(new BN(toWei(this.withdrawAmount)))
        .toString())
      this.tx = tx
    } else {
      const { address, decimals } = this.$store.state.zkopru.registeredTokens.find(({ symbol }) => {
        return symbol === this.activeAsset
      })
      const withdrawAmountDecimal = +this.withdrawAmount * (10 ** +decimals)
      const instantWithdrawFeeDecimal = +(this.instantWithdrawFee || 0) * (10 ** +decimals)
      const decimalAmount = new BN(withdrawAmountDecimal).add(new BN(instantWithdrawFeeDecimal))
      const tx = await this.$store.state.zkopru.wallet.generateTokenWithdrawal(
        this.$store.state.account.accounts[0],
        decimalAmount,
        address,
        (+this.feeAmount * (10 ** 9)).toString(),
        '0',
      )
      this.totalFee = fromWei(tx.fee.toString(), 8)
      this.totalEther = fromWei(new BN(tx.fee)
        .toString())
      this.tx = tx
    }
  }

  async sendTx() {
    if (!this.tx) return
    await this.$store.state.zkopru.wallet.wallet.sendTx({
      tx: this.tx,
    })
    await this.$store.dispatch('loadL2Balance')
    this.$router.push({ path: '/wallet' })
  }

  validateWithdrawAmount() {
    let decimals
    const token = this.$store.state.zkopru.registeredTokens.find(({ symbol }) => {
      return symbol === this.activeAsset
    })
    if (this.activeAsset.toUpperCase() === 'ETH') {
      decimals = 18
    } else if (token) {
      decimals = token.decimals
    } else {
      throw new Error('Invalid asset selected')
    }
    if (this.withdrawAmount === '') {
      this.amountState = 0
    } else if (isNaN(this.withdrawAmount)) {
      this.amountState = 2
    } else if (
      this.activeAsset === 'ETH' &&
      +this.withdrawAmount <= this.$store.state.zkopru.balance &&
      decimalCount(this.withdrawAmount) <= decimals
    ) {
      this.amountState = 1
    } else if (
      this.activeAsset &&
      +this.withdrawAmount <= this.$store.state.zkopru.tokenBalances[this.activeAsset] &&
      decimalCount(this.withdrawAmount) <= decimals
    ) {
      this.amountState = 1
    } else {
      this.amountState = 2
    }
    this.validateInstantWithdrawFee()
  }

  validateInstantWithdrawFee() {
    let decimals
    const token = this.$store.state.zkopru.registeredTokens.find(({ symbol }) => {
      return symbol === this.activeAsset
    })
    if (this.activeAsset.toUpperCase() === 'ETH') {
      decimals = 18
    } else if (token) {
      decimals = token.decimals
    } else {
      throw new Error('Invalid asset selected')
    }
    if (this.instantWithdrawFee === '' || +this.instantWithdrawFee === 0) {
      this.instantWithdrawFeeState = 0
    } else if (isNaN(this.instantWithdrawFee)) {
      this.instantWithdrawFeeState = 2
    } else if (
      this.activeAsset === 'ETH' &&
      +this.instantWithdrawFee < this.$store.state.zkopru.balance &&
      decimalCount(this.instantWithdrawFee) <= decimals
    ) {
      this.instantWithdrawFeeState = 1
    } else if (
      this.activeAsset &&
      +this.instantWithdrawFee < this.$store.state.zkopru.tokenBalances[this.activeAsset] &&
      decimalCount(this.instantWithdrawFee) <= decimals
    ) {
      this.instantWithdrawFeeState = 1
    } else {
      this.instantWithdrawFeeState = 2
    }

    if (
      !isNaN(this.withdrawAmount) &&
      !isNaN(this.instantWithdrawFee) &&
      +this.instantWithdrawFee !== 0 &&
      +this.withdrawAmount <= +this.instantWithdrawFee
    ) {
      this.instantWithdrawFeeState = 2
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
