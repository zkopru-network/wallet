<template>
  <div class="container">
    <div class="popup" v-if="withdrawState === 0">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div class="title-text">
          Confirm Withdrawal
        </div>
        <img
          :src="require('../../assets/close_icon.svg')"
          v-on:click="closeClicked"
          style="cursor: pointer; padding: 4px"
        />
      </div>
      <div spacer style="height: 22px" />
      <div
        class="line-item"
      >
        <div>Withdrawal</div>
        <div>{{ withdrawAmount }} {{activeAsset.toUpperCase()}}</div>
      </div>
      <div
        class="line-item"
        v-if="withdrawType === 2"
      >
        <div>Instant Withdrawal Fee</div>
        <div>{{ instantWithdrawFee }} {{activeAsset.toUpperCase()}}</div>
      </div>
      <div
        class="line-item"
      >
        <div>Layer 2 Fee</div>
        <div>{{ etherFee }} ETH</div>
      </div>
      <div
        class="line-item"
      >
        <div>Fiat Total</div>
        <div>~0.00 USD</div>
      </div>
      <NextButton
        text="Next"
        :onNext="() => withdraw()"
      />
    </div>
    <div class="popup" v-if="withdrawState === 1" style="text-align: center;">
      <div spacer style="height: 47px" />
      <div class="title-text">
        Signing Instant Withdraw
      </div>
      <div spacer style="height: 32px" />
      <div class="detail-text">
        Waiting for signature.
      </div>
      <div spacer style="height: 24px" />
      <img
        :src="require('../../assets/deposit_loading_image.png')"
        style="width: 100%"
      />
    </div>
    <div class="popup" v-show="withdrawState === 5" style="text-align: center;">
      <div spacer style="height: 47px" />
      <div class="title-text">
        {{ loadingTitle }}
      </div>
      <div spacer style="height: 32px" v-if="loadingSubtitle" />
      <div class="detail-text" v-if="loadingSubtitle">
        {{ loadingSubtitle }}
      </div>
      <div spacer style="height: 24px" />
      <div ref="animationEl" style="margin: 0px -22px; width: calc(100% + 44px)" />
    </div>
    <div class="popup" v-if="withdrawState === 3" style="text-align: center;">
      <div spacer style="height: 47px" />
      <div class="title-text">
        Confirming Withdrawal
      </div>
      <div spacer style="height: 32px" />
      <div class="detail-text">
        Closing this window will NOT interrupt the withdrawal.
      </div>
      <div spacer style="height: 24px" />
      <NextButton
        text="See Transaction History"
        :onNext="() => $router.push('/wallet/history')"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import NextButton from './NextButton'
import { ethers } from 'ethers'
import { BigNumber } from "@ethersproject/bignumber";
import lottie from 'lottie-web'

@Component({
  name: 'ConfirmWithdrawPopup',
  components: { NextButton, },
  props: [
    'withdrawAmount',
    'activeAsset',
    'feeAmount',
    'instantWithdrawFee',
    'withdrawType',
    'onClose',
    'tx'
  ],
  computed: {
    etherFee() {
      return ethers.utils.formatEther(this.tx.fee)
    }
  }
})
export default class ConfirmWithdrawPopup extends Vue {
  withdrawState = 0
  prepayInfo = undefined
  loadingTitle = ''
  loadingSubtitle = ''
  ethers = ethers

  mounted() {
    lottie.loadAnimation({
      container: this.$refs.animationEl,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: require('../../assets/loading_animation.json'),
    })
  }

  async signInstantWithdraw() {
    if (this.tx.withdrawals.length !== 1)
      throw new Error(`Expected 1 withdrawal, got ${this.tx.withdrawals.length}`)
    const withdrawal = this.tx.withdrawals[0]
    let decimals = '18'
    if (this.activeAsset !== 'ETH') {
      const { address } = this.$store.state.zkopru.registeredTokens.find(({ symbol }) => {
        return symbol.toUpperCase() === this.activeAsset
      })
      const tokenContract = await this.$store.state.zkopru.client.getERC20Contract(address)
      decimals = await tokenContract.decimals()
      this.$store.state.zkopru.tokensByAddres
    }
    let instantWithdrawFeeNoDecimal = this.instantWithdrawFee
    let precision = 0
    if (this.instantWithdrawFee.indexOf('.') !== -1) {
      precision = this.instantWithdrawFee.split('.')[1].length
      instantWithdrawFeeNoDecimal = this.instantWithdrawFee.replace('.', '')
    }
    console.log(decimals)
    console.log(instantWithdrawFeeNoDecimal)
    const instantWithdrawFeeDecimal = BigNumber.from(instantWithdrawFeeNoDecimal.toString())
      .mul(BigNumber.from('10').pow(decimals))
      .div(BigNumber.from('10').pow(precision))
      .toHexString()
    const msgParams = {
      domain: {
        chainId: this.$store.state.chainId,
        name: 'Zkopru',
        verifyingContract: this.$store.state.zkopru.client.node.layer1.address,
        version: '1',
      },
      primaryType: 'PrepayRequest',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        PrepayRequest: [
          { name: 'prepayer', type: 'address' },
          { name: 'withdrawalHash', type: 'bytes32' },
          { name: 'prepayFeeInEth', type: 'uint256' },
          { name: 'prepayFeeInToken', type: 'uint256' },
          { name: 'expiration', type: 'uint256' },
        ],
      },
      message: {
        prepayer: '0x0000000000000000000000000000000000000000',
        withdrawalHash: withdrawal.hash().toHexString(),
        prepayFeeInEth: this.activeAsset === 'ETH' ? instantWithdrawFeeDecimal : 0,
        prepayFeeInToken: this.activeAsset === 'ETH' ? 0 : instantWithdrawFeeDecimal,
        expiration: Math.floor(+new Date() / 1000) + 24*3600,
      },
    }
    const signedData = await window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params: [this.$store.state.account.accounts[0], JSON.stringify(msgParams)]
    })
    this.prepayInfo = {
      prepayFeeInEth: this.activeAsset === 'ETH' ? instantWithdrawFeeDecimal : 0,
      prepayFeeInToken: this.activeAsset === 'ETH' ? 0 : instantWithdrawFeeDecimal,
      expiration: Math.floor(+new Date() / 1000) + 24*3600,
      signature: signedData,
      data: msgParams,
      signer: this.$store.state.account.accounts[0]
    }
    // then run withdraw
    this.withdrawState = 5
    this.loadingTitle = 'Sending Transaction'
    this.loadingSubtitle = 'Calculating SNARK'
    await this.sendTx()
  }

  async sendTx() {
    const shieldedTx = await this.$store.state.zkopru.wallet.wallet.shieldTx({
      tx: this.tx,
      prepayInfo: this.prepayInfo,
    })
    this.withdrawState = 5
    this.loadingTitle = 'Sending Transaction'
    this.loadingSubtitle = 'Broadcasting transaction'
    const response = await this.$store.state.zkopru.wallet.wallet.sendLayer2Tx(shieldedTx)
    if (response.status !== 200) {
      await this.$store.state.zkopru.wallet.wallet.unlockUtxos(this.tx.inflow)
      throw Error(await response.text())
    }
    await this.$store.dispatch('loadHistory')
    this.withdrawState = 3
  }
  
  async withdraw() {
    if (this.withdrawType === 2 && this.withdrawState === 0) {
      this.withdrawState = 5
      this.loadingTitle = 'Signing Instant Withdraw'
      this.loadingSubtitle = 'Waiting for signature.'
      await this.signInstantWithdraw()
    } else if (this.withdrawType === 1 && this.withdrawState === 0) {
      this.withdrawState = 5
      this.loadingTitle = 'Sending Transaction'
      this.loadingSubtitle = 'Calculating SNARK'
      await this.sendTx()
    }
  }

  closeClicked() {
    if (typeof this.onClose === 'function') {
      this.onClose()
    }
  }
}
</script>

<style scoped>
.container {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: linear-gradient(323.78deg, rgba(0, 0, 0, 0.8) -10.87%, rgba(1, 18, 18, 0.8) 47.21%, rgba(0, 0, 0, 0.8) 101.17%, rgba(0, 0, 0, 0.8) 101.17%);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  padding-top: 117px;
}
.popup {
  border-radius: 8px;
  border: 1px solid #192C35;
  background-color: #05141A;
  max-width: 505px;
  width: 100vw;
  padding: 22px;
}
.line-item {
  padding: 16px 4px;
  font-size: 14px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 1px 0px #2A3D46;
  overflow: auto;
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
