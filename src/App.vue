<template>
  <div id="app">
    <BlurOverlay :blurred="inWalletApp ? !$store.state.zkopru.walletKey : false">
      <router-view />
    </BlurOverlay>
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
import StartSyncPopup from './components/StartSyncPopup'
import BlurOverlay from './components/BlurOverlay'

@Component({
  name: 'App',
  components: { StartSyncPopup, BlurOverlay, },
  watch: {
    '$route' (to, from) {
      this.inWalletApp = this.$route.path.indexOf('/wallet') === 0
      this.startSyncIfNeeded()
    }
  }
})
export default class App extends Vue {
  showingSyncPrompt = false
  inWalletApp = false
  needsSyncStart = true

  async mounted() {
    // only show popup on the actual wallet
    this.inWalletApp = this.$route.path.indexOf('/wallet') === 0
    await this.startSyncIfNeeded()
  }

  async startSyncIfNeeded() {
    if (!this.inWalletApp || !this.needsSyncStart) {
      return
    }
    await this.$store.dispatch('connectMetamask')
    this.needsSyncStart = false
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

<style>
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: normal;
  src: url('../assets/fonts/Inter-Regular.ttf');
}
@font-face {
  font-family: 'Inter';
  font-style: bold;
  font-weight: bold;
  src: url('../assets/fonts/Inter-Bold.ttf');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  src: url('../assets/fonts/Inter-Medium.ttf');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  src: url('../assets/fonts/Inter-Light.ttf');
}
body {
  margin: 0px;
  background: #081B24;
  font-family: 'Inter';
}
</style>
