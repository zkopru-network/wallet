<template>
  <div class="header-container">
    <div v-if="!showBackButton" class="header-text">
      Zkopru Wallet
    </div>
    <div v-if="showBackButton" class="header-text back" v-on:click="prevPath && $router.push({ path: prevPath })">
      <img :src="require('../../assets/back_arrows.svg')" />
      <div spacer style="width: 10px" />
      Zkopru Wallet
    </div>
    <div style="display: flex; align-items: center">
      <!-- progress bar and stuff -->
      <div style="color: white">
        {{ $store.state.zkopru.syncing ? $store.state.zkopru.status : 'Not synchronizing' }}
      </div>
      <ProgressBar :percent="$store.state.zkopru.syncPercent" :showPercent="true" style="width: 240px" />
    </div>
    <div
      class="header-text"
      style="cursor: pointer"
      v-on:click="showingSettings = true"
    >
      Settings
    </div>
    <SettingsPanel
      :visible="showingSettings"
      :onClose="() => showingSettings = false"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ProgressBar from './ProgressBar'
import SettingsPanel from './SettingsPanel'

@Component({
  name: 'Header',
  components: { ProgressBar, SettingsPanel, },
  props: ['showBackButton', 'prevPath'],
})
export default class Header extends Vue {
  showingSettings = false
  showSettings() {
    this.showingSettings = true
  }
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  padding: 24px;
}
.header-text {
  font-size: 16px;
  color: #FFF;
  display: flex;
  align-items: center;
}
.header-text.back {
  cursor: pointer;
}
.clickable {
  cursor: pointer;
}
</style>
