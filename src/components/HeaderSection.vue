<template>
  <div class="header-section-container">
    <div style="display: flex; align-items: center;">
      <ColorImage color="#A2EFE1" :src="require('../../assets/wallet_icon.svg')" />
      <div spacer style="width: 4px" />
      <div class="info-text">Your wallet and Zkopru transactions are private</div>
    </div>
    <div style="display: flex">
      <div class="header-button">
        <ColorImage color="#95A7AE" width="18px" height="18px" :src="require('../../assets/info_icon.svg')" />
        <div spacer style="width: 4px" />
        <div>Info</div>
      </div>
      <div class="header-button" v-on:click="showingSettings = true">
        <ColorImage color="#95A7AE" width="18px" height="18px" :src="require('../../assets/settings_cog.svg')" />
        <div spacer style="width: 4px" />
        <div>Settings</div>
      </div>
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
import ColorImage from './ColorImage'
import SettingsPanel from './SettingsPanel'

@Component({
  name: 'HeaderSection',
  components: { ColorImage, SettingsPanel, },
})
export default class HeaderSection extends Vue {
  showingSettings = false
}
</script>

<style scoped>
.header-section-container {
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  height: 46px;
}
.info-text {
  color: #95A7AE;
  font-size: 11px;
}
.header-button {
  color: #95A7AE;
  font-size: 14px;
  margin: 0px 9px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
</style>
