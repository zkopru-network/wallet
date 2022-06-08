<template>
  <div class="header-section-container">
    <div style="display: flex; align-items: center;">
      <ColorImage color="#A2EFE1" :src="require('../../assets/wallet_icon.svg')" />
      <div spacer style="width: 4px" />
      <div class="info-text">Your wallet and Zkopru transactions are private</div>
    </div>
    <div style="display: flex">
      <div class="network-container" v-on:click="dropdownClick">
        <div spacer style="height: 9.5px"></div>
        <div class="network-button">
          <img :src="require('../../assets/network_status_connected.svg')" />
          <p class="network-font" style="padding-left: 8px; padding-right: 6px">{{ networks[this.$store.state.chainId.toString()].NAME }}</p>
          <svg width="6" height="5" viewBox="0 0 6 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.80778 4.26953L0.759961 1.81215C0.325743 1.29109 0.696267 0.5 1.37454 0.5L4.62514 0.5C5.30341 0.5 5.67393 1.29109 5.23972 1.81215L3.19189 4.26953C3.09194 4.38947 2.90773 4.38947 2.80778 4.26953Z"
              fill="#95A7AE" />
          </svg>
        </div>
        <template v-if="showingNetwork">
          <div v-for="chainId in Object.keys(networks)" :key="networks[chainId]" class="network-dropdown">
            <div class="network-dropdown-row" v-if="isCurrentChainId(chainId)"
              v-on:click="selectNetwork(parseInt(chainId))">{{ networks[chainId].NAME }}</div>
          </div>
        </template>
        <div spacer style="height: 9.5px"></div>
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
    <SettingsPanel :visible="showingSettings" :onClose="() => showingSettings = false" />
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

  networks = this.$store.getters.networkList

  openDocs() {
    window.open('https://docs.zkopru.network', '_blank')
  }

  dropdownClick() {
    this.showingNetwork = !this.showingNetwork
  }

  isCurrentChainId(chainId) {
    return this.$store.state.chainId.toString() != chainId
  }

  selectNetwork(chainId) {
    this.$store.dispatch('changeNetwork', chainId)
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

.network-container {
  color: #95A7AE;
  display: flex;
  flex-direction: column;
  align-items: center;
  vertical-align: middle;
}

.network-button {
  border: 1px solid #CFF5EE;
  border-radius: 20px;
  height: 25px;
  width: 130px;
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.network-font {
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  line-height: 25px;
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
