<template>
  <CenteredLeftMenu>
    <div spacer style="height: 70px" />
    <div class="section-container">
      <div class="title-text" style="display: flex; align-items: center">
        <div style="display: flex">
          <div> {{ this.amountState }} Send</div>
          <div spacer style="width: 10px" />
          <img height="13px" :src="tryLoadAssetIcon(activeAsset)" />
        </div>
        <div spacer style="flex: 1" />
        <InfoText :text="tooltips.SEND_ASSET" />
      </div>
      <div spacer style="height: 23px" />
      <AssetDropdown :activeAsset="activeAsset" v-model="activeAsset" :showIcon="false" />
      <div spacer v-if="!!activeAsset" style="height: 16px" />
      <AssetAmountField v-if="!!activeAsset" :asset="activeAsset" v-model="transferAmount"
        :assetAmountState="amountState" :buttons="['Max']" :buttonClicked="maxAmount.bind(this)" />
      <div spacer v-if="amountState === 4" style="height: 18px" />
      <div v-if="amountState === 4" style="display: flex; align-items: center">
        <img :src="require('../assets/warning.svg')" />
        <div spacer style="width: 13px" />
        <div style="color: #F49F2F; font-size: 12px">
          You can't send more than your max amount
        </div>
      </div>
    </div>
    <div class="section-container">
      <div class="title-text">
        <div style="display: flex; align-items: center">
          <div>To</div>
          <div spacer style="flex: 1" />
          <InfoText :text="tooltips.SEND_TO" />
        </div>
      </div>
      <div spacer style="height: 23px" />
      <AddressField v-model="zkAddress" :address="zkAddress" />
    </div>
    <div class="section-container" style="margin-bottom: 0px">
      <div style="display: flex; flex-direction: column; justify-content: center">
        <div class="title-text">
          <div style="display: flex; align-items: center">
            <div>Fee in GWEI</div>
            <div spacer style="flex: 1" />
            <InfoText :text="tooltips.SEND_FEE" />
          </div>
        </div>
        <div spacer style="height: 23px" />
        <AssetAmountField v-model="fee" :assetAmountState="feeState" :buttons="['Fast', 'Standard']"
          :buttonClicked="suggestedFee.bind(this)" />
      </div>
    </div>
    <NextButton :disabled="fee == '' || amountState != 1 || zkAddress == ''"
      :onNext="() => showingTransferConfirm = true" />
    <ConfirmTransferPopup v-if="showingTransferConfirm" :transferAmount="transferAmount" :feeAmount="totalFee"
      :activeToken="activeAsset" :zkAddress="zkAddress" :tx="tx" :onClose="() => showingTransferConfirm = false" />
  </CenteredLeftMenu>
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
import { ethers } from 'ethers'
import CenteredLeftMenu from './components/CenteredLeftMenu'
import NextButton from './components/NextButton'
import ConfirmTransferPopup from './components/ConfirmTransferPopup'
import tooltips from './tooltips'
import InfoText from './components/InfoText'
import decimalCount from './utils/decimal-count'
// import { txSizeCalculator } from '@zkopru/utils'

@Component({
  name: 'Transfer',
  components: { Header, AssetDropdown, Button, AddressField, FeeField, AssetAmountField, CenteredLeftMenu, NextButton, ConfirmTransferPopup, InfoText, },
  watch: {
    transferAmount() {
      this.generateTx()
      this.updateAmountStates()
    },
    zkAddress() {
      this.generateTx()
    },
    fee() {
      this.generateTx()
      this.updateAmountStates()
    },
    etherAmount() {
      this.updateAmountStates()
    },
    activeAsset(newVal, oldVal) {
      if (newVal === oldVal) return
      this.transferAmount = ''
    }
  },
})
export default class Transfer extends Vue {
  tooltips = tooltips
  activeAsset = ''
  transferAmount = '0'
  transferableAmount = '0' // max transfer amount
  amountState = 0
  zkAddress = ''
  fee = ''
  precalculatedFee = ''
  feeState = 0
  totalFee = '-'
  tx = undefined
  showingTransferConfirm = false
  activeFeePromise = undefined
  ethers = ethers
  mounted() {
    if (this.$route.query.asset) {
      this.activeAsset = this.$route.query.asset.toUpperCase()
    }
  }

  paramString() {
    return `${this.zkAddress}-${this.fee}-${this.transferAmount}`
  }

  txSizeCalculator(
    inflowNum, // number
    outflowNum, // number
    crossLayerOutflowNum, //number
    hasSwap, // boolean
    noMemo// boolean
  ) {
    let size = 0
    size += 1 // inflow num length
    size += inflowNum * 32 // inflow root
    size += inflowNum * 32 // inflow nullifier
    size += 1 // outflow num length
    size += outflowNum * 32 // outflow note hash
    size += outflowNum * 1 // outflow type identifier
    size += crossLayerOutflowNum * 20 // cross-layer outflow has 'to' address data
    size += crossLayerOutflowNum * 32 // cross-layer outflow has 'th data
    size += crossLayerOutflowNum * 20 // cross-layer outflow has token address data
    size += crossLayerOutflowNum * 32 // cross-layer outflow has token amount
    size += crossLayerOutflowNum * 32 // cross-layer outflow has nft id
    size += crossLayerOutflowNum * 32 // cross-layer outflow has fee
    size += 1 // swap & memo indicator
    size += hasSwap ? 32 : 0 // note hash to swap with
    size += noMemo ? 0 : 81 // note hash to swap
    size += 256 // snark proof size
    return size
  }

  async maxAmount() {
    // initialize defer
    this.transferableAmount = '0'
    // await this.$store.dispatch('loadL2Balance')
    // fee set
    if (this.fee == '' || !this.fee) {
      console.log(`fee does not set - run suggestedFee`)
      await this.suggestedFee('Standard')
      console.log(`this.fee: ${this.fee}`)
    }

    if (this.totalFee == '-' || this.totalFee == Infinity) {
      // const { maxSpendable } = this.$store.state.zkopru.noteInfo["ETH"]
      // this.transferAmount = ethers.utils.formatEther(maxSpendable.toString())

      const txSize = this.txSizeCalculator(4, this.asset == 'ETH' ? 1 : 2, 0, false, false)
      const totalFeeInWei = ethers.utils.parseUnits((this.fee * txSize).toString(), 'gwei')
      this.totalFee = ethers.utils.formatEther(totalFeeInWei.toString()).toString()
    }

    let noteLimit = 3;
    if (this.activeAsset && this.activeAsset.toUpperCase() == 'ETH') noteLimit += 1

    // check ETH note for activeAsset or Fee
    const { maxSpendable } = this.$store.state.zkopru.noteInfo["ETH"]

    const maxSpendNote = ethers.BigNumber.from(maxSpendable)
    const parsedFee = ethers.utils.parseEther(this.totalFee)
    const subMaxSpendNote = maxSpendNote.sub(parsedFee)
    this.transferAmount = ethers.utils.formatEther(subMaxSpendNote.toString())

    if (maxSpendNote.lt(parsedFee)) {
      this.transferAmount = '0'
    } else {
      const notes = this.$store.state.zkopru.noteInfo[this.activeAsset]
      // console.log(`maxSpendNote less - notes: ${this.activeAsset} ${JSON.stringify(notes)}`)
      const { count, largestNotes } = notes

      if (count <= noteLimit) {
        this.transferableAmount = ethers.utils.parseEther(this.transferAmount).sub(parsedFee).toString()
      } else {
        let amountAccu = ethers.utils.parseEther(this.transferableAmount)
        for (let i = 0; i < noteLimit; i++) {
          amountAccu = amountAccu.add(largestNotes[i])
        }
        this.transferableAmount = amountAccu.sub(parsedFee).toString()
      }
      largestNotes.sort((a, b) => ethers.BigNumber.from(a).lt(ethers.BigNumber.from(b)) ? 1 : -1)
      const sumNotesWithIn = largestNotes.slice(1, noteLimit).reduce((sum, amount) => { return sum.add(ethers.BigNumber.from(amount)) }, ethers.BigNumber.from(largestNotes[0]))
      this.transferAmount = ethers.utils.formatEther(sumNotesWithIn.sub(parsedFee).toString()).toString()
    }
    if (ethers.utils.parseEther(this.transferAmount).gt(ethers.utils.parseEther(this.transferableAmount))) this.transferAmount = ethers.utils.formatEther(this.transferableAmount.toString())
  }

  getTranferableAmount() {
    let noteLimit = 3;
    if (this.activeAsset && this.activeAsset.toUpperCase() == 'ETH') noteLimit += 1

    const notes = this.$store.state.zkopru.noteInfo[this.activeAsset]
    const { largestNotes } = notes

    let amountAccu = ethers.utils.parseEther('0')
    for (let i = 0; i < noteLimit; i++) {
      amountAccu = amountAccu.add(largestNotes[i])
    }
    return amountAccu
  }

  async suggestedFee(clickedButton) {
    let feePromise
    try {
      this.feeState = 3
      feePromise = this.$store.dispatch('loadCurrentWeiPerByte')
      this.activeFeePromise = feePromise
      const weiPerByte = await feePromise
      if (this.activeFeePromise !== feePromise) return
      this.activeFeePromise = undefined
      this.fee = Math.floor((clickedButton === 'Standard' ? 5 : 15) * +weiPerByte / (10 ** 9))
    } catch (err) {
      if (this.activeFeePromise === feePromise) this.activeFeePromise = undefined
      this.feeState = 2
    }
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
    try {
      if (this.activeAsset === 'ETH') {
        let tx
        tx = await this.$store.state.zkopru.wallet.generateEtherTransfer(
          this.zkAddress,
          ethers.utils.parseEther(this.transferAmount).toString(),
          ethers.utils.parseUnits(this.fee.toString(), 'gwei').toString(),
        )

        // `transferableAmount` set means that user chosse 'max'
        if (this.transferableAmount != '0' && this.totalFee != ethers.utils.formatEther(tx.fee.toString())) {
          let parsedFee
          if (this.totalFee == '-') {
            parsedFee = '0'
          } else if (this.totalFee == Infinity) {
            parsedFee = '0'
          }
          // 
          const diffEther = ethers.utils.parseEther(parsedFee.toString()).sub(ethers.utils.parseUnits(tx.fee.toString(), 'wei'))

          // recalculating Ether
          const adjustdAmount = ethers.utils.parseEther(this.transferAmount).add(diffEther)

          // regenerate Tx
          tx = await this.$store.state.zkopru.wallet.generateEtherTransfer(
            this.zkAddress,
            adjustdAmount.toString(),
            ethers.utils.parseUnits(this.fee.toString(), 'gwei').toString(),
          )
        }
        this.totalFee = ethers.utils.formatEther(tx.fee.toString()).toString()
        this.totalEther = ethers.utils.parseEther(this.totalFee).add(ethers.utils.parseEther(this.transferAmount)).toString()
        this.tx = tx
      } else {
        const { address, decimals } = this.$store.state.zkopru.registeredTokens.find(({ symbol }) => {
          return symbol === this.activeAsset
        })
        const tx = await this.$store.state.zkopru.wallet.generateTokenTransfer(
          this.zkAddress,
          ethers.utils.parseUnits(this.transferAmount, decimals),
          address,
          ethers.utils.parseUnits(this.fee.toString(), 'gwei').toString(),
        )
        this.totalFee = ethers.utils.formatEther(tx.fee.toString()).toString()
        this.totalEther = this.totalFee
        this.tx = tx
      }
    } catch (err) {
      if (err.toString().indexOf('Not enough Ether') !== -1) {
        this.totalFee = Infinity
        this.totalEther = Infinity
        this.feeState = 2
        if (this.activeAsset === 'ETH') {
          this.amountState = 4
        }
      }
      if (err.toString().indexOf('inflow != outflow') !== -1) {
        // TODO: when user manually set amount with decimal points
        // finalChanges in outflow are missing
        // Should fix this. https://github.com/wanseob/zkopru/blob/5aaf5e3d43ad2e0a3ad036e078b5f9d68d69ab14/packages/transaction/src/tx-builder.ts#L402-L416
        this.amountState = 2
      }
      console.log(err)
    }
    // reset transferableAmount
    this.transferableAmount = '0'
  }

  async sendTx() {
    if (!this.tx) return
    await this.$store.state.zkopru.wallet.wallet.sendTx({
      tx: this.tx,
    })
    await this.$store.dispatch('loadL2Balance')
    this.$router.push({ path: '/wallet' })
  }

  tryLoadAssetIcon(symbol) {
    try {
      return require(`../assets/token_icons/${symbol.toUpperCase()}.svg`)
    } catch (_) {
      return require('../assets/token_no_icon.png')
    }
  }

  updateAmountStates() {
    let decimals
    const token = this.$store.state.zkopru.registeredTokens.find(({ symbol }) => {
      return symbol === this.activeAsset
    })
    if (this.activeAsset.toUpperCase() === 'ETH') {
      decimals = 18
    } else if (token) {
      decimals = token.decimals
    } else {
      decimals = 0
    }
    if (this.transferAmount === '') {
      this.amountState = 0
    } else if (isNaN(this.transferAmount)) {
      this.amountState = 2
    } else if (
      this.activeAsset === 'ETH' &&
      +this.transferAmount <= +this.$store.state.zkopru.balance &&
      decimalCount(this.transferAmount) <= decimals
    ) {
      this.amountState = 1
    } else if (
      +this.transferAmount <= +this.$store.state.zkopru.tokenBalances[this.activeAsset] &&
      decimalCount(this.transferAmount) <= decimals
    ) {
      this.amountState = 1
    } else {
      this.amountState = 2
    }
    if (!this.fee) {
      this.feeState = 0
    } else if (isNaN(this.fee) || +this.fee <= 0) {
      this.feeState = 2
    } else {
      this.feeState = 1
    }
    if (isNaN(this.totalEther)) return
    if (ethers.utils.parseUnits(this.totalEther, 'wei').gt(ethers.utils.parseEther(this.$store.state.zkopru.balance))) {
      if (this.activeAsset === 'ETH') {
        this.amountState = 2
      }
      this.feeState = 2
    }
    // check exceed maxSpendable amount
    const maxSpendableAmount = this.getTranferableAmount()
    const settleAmount = ethers.utils.parseEther(this.transferAmount).add(ethers.utils.parseEther(this.totalFee))
    if (settleAmount.gt(maxSpendableAmount)) {
      this.amountState = 4
    }
  }
}
</script>
<style scoped>
.small-text {
  font-size: 12px;
}

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
