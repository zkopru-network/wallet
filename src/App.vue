<template>
  <div id="app">
    <router-view />
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

@Component({
  name: 'App',
  components: { StartSyncPopup, },
})
export default class App extends Vue {
  showingSyncPrompt = false

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
