<template>
  <div class="container">
    <LeftMenu />
    <div style="display: flex; flex-direction: column; flex: 1;height: 100%">
      <div style="display: flex; align-items: center; box-shadow: 0px 1px 0px #2A3D46;">
        <div style="position: relative; display: flex; flex: 1">
          <input
            type="text"
            class="search-text-input"
            v-model="filterText"
            placeholder="search"
          />
          <img
            style="position: absolute; left: 7px; top: 12px"
            :src="require('../assets/search_icon.svg')"
            height="24px"
            width="24px"
            color="#5D7078"
          />
        </div>
        <div class="header-button" v-on:click="$router.push({ path: '/wallet/history' })">
          History
        </div>
        <div spacer style="width: 16px" />
        <div class="header-button" v-on:click="showingSettings = true">
          Settings
        </div>
        <div spacer style="width: 16px" />
        <div class="header-button">
          Support
        </div>
        <div spacer style="width: 32px" />
      </div>
      <div class="subheader-container">
        <div class="tokens-button">
          Tokens
        </div>
        <div spacer style="flex: 1" />
        <div class="receive-button" v-on:click="showingAddressPopup = true">
          <img :src="require('../assets/receive_button_icon.svg')" />
          <div spacer style="width: 13px" />
          Receive
        </div>
        <div spacer style="width: 10px" />
        <div class="send-button" v-on:click="$router.push({ path: '/wallet/transfer' })">
          <img :src="require('../assets/send_button_icon.svg')" />
          <div spacer style="width: 13px" />
          Send
        </div>
      </div>
      <div style="display: flex; flex-direction: column; padding: 13px 21px">
        <div style="display: flex; width: 100%; align-items: center">
          <div class="detail-text">ETH</div>
          <div spacer style="flex: 1" />
          <div class="detail-text">Your wallet and Zkopru transactions are private</div>
          <img :src="require('../assets/shield_icon.svg')" />
        </div>
        <div spacer style="height: 22px" />
        <div style="display: flex">
          <AssetCell
            symbol="ETH"
          />
        </div>
        <div spacer style="height: 54px" />
        <div class="detail-text">Tokens</div>
        <div spacer style="height: 22px" />
        <div style="display: flex">
          <AssetCell
            v-for="asset in filteredAssets"
            :symbol="asset"
            :tokenAddr="asset.tokenAddr"
            :key="asset"
          />
        </div>
      </div>
      <div spacer style="flex: 1" />
      <div style="padding: 8px;  display: flex">
        <div style="color: white">
          {{ $store.state.zkopru.syncing ? $store.state.zkopru.status : 'Not synchronizing' }} - {{$store.state.zkopru.syncPercent}}%
        </div>
      </div>
    </div>
    <AddressPopup
      :visible="showingAddressPopup"
      :onCancel="() => showingAddressPopup = false"
    />
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
import SwitchSelector from './components/SwitchSelector'
import Button from './components/Button'
import AssetCell from './components/AssetCell'
import ZkopruBackground from './components/ZkopruBackground'
import AddressPopup from './components/AddressPopup'
import ColorImage from './components/ColorImage'
import SettingsPanel from './components/SettingsPanel'
import LeftMenu from './components/LeftMenu'

@Component({
  name: 'Wallet',
  components: { Header, SwitchSelector, Button, AssetCell, ZkopruBackground, AddressPopup, ColorImage, SettingsPanel, LeftMenu, },
  watch: {
    filterText: function() {
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
  showingAddressPopup = false
  filteredAssets = []
  filterText = ''
  displayMode = 1
  assetType = 0
  showingSettings = false

  mounted() {
    this.filterAssets()
  }

  filterAssets() {
    this.filteredAssets = this.assets.filter((symbol) => {
      if (symbol === 'ETH') return false
      return symbol.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1
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
  box-shadow: 0px 1px 0px #2A3D46;
  display: flex;
  align-items: center;
  padding: 8px;
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
  padding: 8px 24px;
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
  padding: 8px 24px;
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
