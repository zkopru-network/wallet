<template>
  <div class="container">
    <LeftMenu />
    <div style="display: flex; flex-direction: column; flex: 1;height: 100%">
      <HeaderSection />
      <div class="subheader-container">
        <div class="tokens-button">
          Tokens
        </div>
        <div spacer style="flex: 1" />
        <div class="receive-button" v-on:click="$router.push({ path: '/wallet/receive' })">
          <ColorImage color="#A2EFE1" :src="require('../assets/receive_icon_new.svg')" />
          <div spacer style="width: 13px" />
          Receive
        </div>
        <div spacer style="width: 10px" />
        <div class="send-button" v-on:click="$router.push({ path: '/wallet/transfer' })">
          <ColorImage color="#000000" :src="require('../assets/send_icon_new.svg')" />
          <div spacer style="width: 13px" />
          Send
        </div>
      </div>
      <div style="padding: 16px">
        <SearchField v-model="searchText" />
      </div>
      <AssetCell
        symbol="ETH"
      />
      <AssetCell
        v-for="asset in filteredAssets"
        :symbol="asset"
        :tokenAddr="asset.tokenAddr"
        :key="asset"
      />
      <div spacer style="flex: 1" />
      <SyncIndicator />
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
import Header from './components/Header'
import Button from './components/Button'
import AssetCell from './components/AssetCell'
import ZkopruBackground from './components/ZkopruBackground'
import ColorImage from './components/ColorImage'
import SettingsPanel from './components/SettingsPanel'
import LeftMenu from './components/LeftMenu'
import HeaderSection from './components/HeaderSection'
import SearchField from './components/SearchField'
import SyncIndicator from './components/SyncIndicator'

@Component({
  name: 'Wallet',
  components: { Header, Button, AssetCell, ZkopruBackground, ColorImage, SettingsPanel, LeftMenu, HeaderSection, SearchField, SyncIndicator, },
  watch: {
    searchText: function() {
      this.filterAssets()
    },
    assets() {
      this.filterAssets()
    }
  },
  computed: {
    assets() {
      return ['ETH', ...this.$store.state.zkopru.registeredTokens.map(({ symbol }) => symbol)]
    }
  }
})
export default class Wallet extends Vue {
  filteredAssets = []
  displayMode = 1
  assetType = 0
  showingSettings = false
  searchText = ''

  async mounted() {
    this.filterAssets()
    await this.$store.dispatch('connectMetamask')
  }

  filterAssets() {
    this.filteredAssets = this.assets.filter((symbol) => {
      if (symbol === 'ETH') return false
      return symbol.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1
    })
  }
}
</script>
<style scoped>
.container {
  display: flex;
  height: 100vh;
}
.search-text-input {
  background: transparent;
  border-radius: 4px;
  border: 0px solid white;
  color: white;
  font-size: 14px;
  text-indent: 39px;
  height: 44px;
  flex: 1;
}
.search-text-input:focus {
  border-color: rgba(0, 0, 0, 0);
  border: 0px solid rgba(0, 0, 0, 0);
  outline: 0px solid rgba(0, 0, 0, 0);
}
.search-text-input:placeholder {
  font-size: 14px;
  color: #5D7078;
}
.header-button {
  color: white;
  cursor: pointer;
}
.subheader-container {
  border-top: 1px solid #2A3D46;
  border-bottom: 1px solid #2A3D46;
  display: flex;
  align-items: center;
  padding: 8px 16px;
}
.tokens-button {
  color: white;
  font-size: 16px;
  box-shadow: 0px 1px 0px #9EFFEE;
  padding: 8px;
}
.receive-button {
  border: 1px solid #85C7BD;
  box-sizing: border-box;
  border-radius: 20px;
  color: #85C7BD;
  font-size: 16px;
  padding: 4px 24px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
}
.send-button {
  background: #A2EFE1;
  border-radius: 20px;
  color: black;
  font-size: 16px;
  padding: 4px 24px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
}
.detail-text {
  color: #95A7AE;
  font-size: 11px;
}
</style>
