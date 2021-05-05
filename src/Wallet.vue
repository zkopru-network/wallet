<template>
  <div class="container">
    <Header />
    <div class="wallet-body">
      <div class="wallet-title">
        Account
      </div>
      <div spacer style="height: 8px" />
      <div class="wallet-subtitle">
        <Copyable :fullText="$store.state.zkopru.zkAddress">
          {{ $store.state.zkopru.shortZkAddress }}
        </Copyable>
      </div>
      <div class="horizontal-divider" />
      <div style="display: flex">
        <div style="display: flex; flex-direction: column">
          <WalletHeader
            v-model:mode="walletMode"
          />
          <div spacer style="height: 40px" />
          <WalletDeposit v-if="walletMode === 0" />
          <WalletTransfer v-if="walletMode === 1" />
          <WalletWithdraw v-if="walletMode === 2" />
        </div>
        <img
          src="../assets/wallet_animation.png"
          style="padding: 75px"
        />
      </div>
    </div>
    <ZkopruBackground />
    <StartSyncPopup
      :visible="showingSyncPrompt"
      :onCancel="() => showingSyncPrompt = false"
      :startSync="startSync"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Header from './components/Header'
import ZkopruBackground from './components/ZkopruBackground'
import Button from './components/Button'
import StartSyncPopup from './components/StartSyncPopup'
import WalletHeader from './components/WalletHeader'
import WalletDeposit from './components/WalletDeposit'
import WalletTransfer from './components/WalletTransfer'
import WalletWithdraw from './components/WalletWithdraw'
import Copyable from './components/Copyable'

@Component({
  name: 'Wallet',
  components: {
    Header,
    ZkopruBackground,
    Button,
    StartSyncPopup,
    WalletHeader,
    WalletDeposit,
    WalletTransfer,
    WalletWithdraw,
    Copyable,
  },
})
export default class Wallet extends Vue {
  address = '75a...987'
  showingSyncPrompt = false
  walletMode = 0

  async mounted() {
    await this.$store.dispatch('connectMetamask')
    if (
      !this.$store.state.wallet.autosyncEnabled ||
      !this.$store.state.wallet.autosyncPromptShown
    ) {
      this.showingSyncPrompt = true
    } else if (this.$store.state.wallet.autosyncEnabled) {
      await this.$store.dispatch('startSync')
    }
  }

  async startSync() {
    this.showingSyncPrompt = false
    this.$store.state.wallet.autosyncPromptShown = true
    this.$store.dispatch('saveState')
    await this.$store.dispatch('startSync')
  }

}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.wallet-body {
  max-width: 1282px;
  margin-left: 80px;
  margin-right: 80px;
  padding-top: 36px;
  padding-bottom: 36px;
  background-color: rgba(8, 27, 36, 0.7);
  border: 1px solid #5D7078;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-self: center;
}
.wallet-title {
  color: white;
  font-weight: bold;
  font-size: 24px;
  align-self: center;
  letter-spacing: 0.1em;
}
.wallet-subtitle {
  color: white;
  font-size: 18px;
  align-self: center;
}
.horizontal-divider {
  height: 1px;
  background-color: #5D7078;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 38px;
  margin-bottom: 28px;
}
</style>
