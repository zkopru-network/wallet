<template>
  <div class="header-section-container">
    <div style="display: flex; align-items: center;">
      <ColorImage color="#A2EFE1" :src="require('../../assets/wallet_icon.svg')" />
      <div spacer style="width: 4px" />
      <div class="info-text">Your wallet and Zkopru transactions are private</div>
    </div>
    <div style="display: flex">
      <div class="header-button grow-container" v-on:click="dropdownClick">
        <div>Select Network</div>
        <div v-if="showingNetwork" class="network-dropdown">
          <div class="network-dropdown-row" v-on:click="selectNetwork(5)" >Goerli Testnet</div>
          <div class="network-dropdown-row" v-on:click="selectNetwork(69)">Optimism Testnet</div>
          </div>
        <div spacer style="width: 24px" />
      </div>
      <div class="header-button" v-on:click="openDocs()">
        <ColorImage color="#95A7AE" width="18px" height="18px" :src="require('../../assets/docs_icon.svg')" />
        <div spacer style="width: 4px" />
        <div>Docs</div>
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

  showingNetwork = false

  currentNetwork = 5 // default on goerli testnet

  openDocs() {
    window.open('https://docs.zkopru.network', '_blank')
  }

  dropdownClick() {
    this.showingNetwork = !this.showingNetwork
  }

  selectNetwork(networkId) {
    this.currentNetwork = networkId
    console.log(`current network id: ${this.currentNetwork}`)
  }

}
</script>

<style scoped>
.header-section-container {
  display: flex;
  justify-content: space-between;
  padding: 0px 10px;
  height: 46px;
  border-bottom: 1px solid #2A3D46;
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
.grow-container {
  display: flex;
  width: 100%;
  justify-content: center;
}
.network-dropdown {
  position: absolute;
  top: 100%;
  border: 1px solid #3B4E56;
  border-top: 0px solid #3B4E56;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  z-index: 10;
}
.network-dropdown-row {
  background-color: #081B24;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  width: calc(100% - 13px - 13px);
  padding: 13px;
}

</style>
