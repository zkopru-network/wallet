<template>
  <div class="header-container">
    <div style="display: flex; align-items: center">
      <div class="header-title-text">
        zkopru wallet
      </div>
      <div spacer style="width: 17px" />
      <div class="clickable" v-on:click="showSettings">
        <img src="../../assets/settings_cog.svg" />
      </div>
    </div>
    <div style="display: flex; align-items: center">
      <!-- progress bar and stuff -->
      <div style="color: white">
        {{ $store.state.zkopru.syncing ? $store.state.zkopru.status : 'Not synchronizing' }}
      </div>
      <ProgressBar :percent="$store.state.zkopru.syncPercent" :showPercent="true" style="width: 240px" />
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
.header-title-text {
  font-weight: bold;
  font-size: 32px;
  color: #D0FFF7;
}
.clickable {
  cursor: pointer;
}
</style>
