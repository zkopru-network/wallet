<template>
  <CenteredLeftMenu>
    <div spacer style="height: 70px" />
    <div eth v-if="depositType === 1 || depositType === 3" class="section-container">
      <div class="title-text" style="display: flex; align-items: center">
        <div>Deposit</div>
        <div spacer style="width: 10px" />
        <img height="13px" :src="require('../assets/token_icons/ETH.svg')" />
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
        <div>Deposit</div>
        <div spacer style="width: 10px" />
        <img height="13px" :src="tryLoadAssetIcon(activeToken)" />
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
        />
      </div>
    </div>
    <div class="section-container">
      <div class="title-text">Coordinator Fee</div>
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
      :onNext="() => showingDepositConfirm = true"
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

@Component({
  name: 'Deposit',
  components: { AssetDropdown, AssetAmountField, Checkbox, NextButton, CenteredLeftMenu, ConfirmDepositPopup, },
  watch: {
    etherDepositAmount() {
      this.updateEtherAmountState()
    },
    tokenDepositAmount() {
      if (this.tokenDepositAmount === '') {
        this.tokenAmountState = 0
      } else if (isNaN(this.tokenDepositAmount) || +this.tokenDepositAmount <= 0) {
        this.tokenAmountState = 2
      } else {
        this.tokenAmountState = 0
      }
    },
    feeAmount() {
      this.updateEtherAmountState()
    },
  }
})
export default class Deposit extends Vue {
  activeToken = ''
  etherAmountState = 0
  etherDepositAmount = '0'
  tokenAmountState = 0
  tokenDepositAmount = '0'
  feeAmount = '0'
  feeAmountState = 0
  depositType = 0
  showingDepositConfirm = false

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
    const multiplier = clickedButton === 'Fast' ? new BN('400000') : new BN('200000')
    this.feeAmountState = 3
    try {
      const weiPerByte = await this.$store.dispatch('loadCurrentWeiPerByte')
      // Assume 2000 bytes for a simple deposit tx in a block
      const feeWeiAmount = new BN(weiPerByte).mul(multiplier)
      this.feeAmount = ''
      Vue.nextTick(() => {
        this.feeAmount = fromWei(feeWeiAmount, 9).toString()
      })
    } catch (err) {
      this.feeAmountState = 2
    }
  }

  async deposit() {
    if (this.depositType === 3 && this.etherAmountState === 1) {
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

  updateEtherAmountState() {
    if (this.feeAmount === '' || this.feeAmount === '0') {
      this.feeAmountState = 0
    } else if (isNaN(this.feeAmount) || +this.feeAmount < 0) {
      this.feeAmountState = 2
    } else {
      this.feeAmountState = +this.feeAmount > +this.$store.state.account.balance ? 2 : 1
    }
    if (this.etherDepositAmount === '') {
      this.etherAmountState = 0
    } else if (isNaN(this.etherDepositAmount) || +this.etherDepositAmount <= 0) {
      this.etherAmountState = 2
    } else {
      this.etherAmountState = +this.etherDepositAmount > +this.$store.state.account.balance ? 2 : 1
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
