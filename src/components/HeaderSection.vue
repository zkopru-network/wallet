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
        <div class="network-button" v-bind:style="showingNetwork ? { 'background-color': '#192C35' } : {}">
          <img v-if="this.$store.state.zkopru.syncing" :src="require('../../assets/network_status_connected.svg')" />
          <img v-else :src="require('../../assets/network_status_disconnected.svg')" />
          <p class="network-font">{{
              networks[this.$store.state.chainId.toString()].NAME
          }}</p>
          <svg width="6" height="5" style="padding-right: 12px" viewBox="0 0 6 5" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.80778 4.26953L0.759961 1.81215C0.325743 1.29109 0.696267 0.5 1.37454 0.5L4.62514 0.5C5.30341 0.5 5.67393 1.29109 5.23972 1.81215L3.19189 4.26953C3.09194 4.38947 2.90773 4.38947 2.80778 4.26953Z"
              fill="#95A7AE" />
          </svg>
        </div>
        <div v-if="showingNetwork" class="network-dropdown">
          <div v-for="(chainId, index) in Object.keys(networks)" :key="index">
            <div v-if="isSelectableChainId(chainId)" class="network-dropdown-row"
              v-on:click="selectNetwork(parseInt(chainId))">
              <p class="network-font">
                {{ networks[chainId].NAME }}
              </p>
            </div>
          </div>
        </div>
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

  isSelectableChainId(chainId) {
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
  margin-right: 16px;
}

.network-button {
  border: 1px solid #CFF5EE;
  border-radius: 20px;
  height: 25px;
  width: 130px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
}

.network-font {
  font-family: Inter;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  line-height: 25px;
}

.network-dropdown {
  position: absolute;
  background-color: #05141A;
  width: 130px;
  top: 90%;
  border: 0.5px solid #4C5F67;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 9px;
  padding-bottom: 9px;
  z-index: 10;
}

.network-dropdown-row {
  margin: 0 auto;
  align-items: center;
  height: 27px;
  z-index: 100;
}

.network-dropdown-row p {
  margin: 0 auto;
}

.network-dropdown-row:hover {
  background-color: #192C35;
}
</style>
