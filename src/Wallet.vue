<template>
  <div class="container">
    <Header />
    <div spacer style="height: 90px" />
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap">
      <!-- subheader buttons-->
      <SwitchSelector
        :options="[
          {
            text: 'Tokens',
            image: require('../assets/shield_black.svg'),
            activeColor: 'black',
            inactiveColor: 'white',
          },
          {
            text: 'NFTs',
            image: require('../assets/shield_black.svg'),
            activeColor: 'black',
            inactiveColor: 'white',
          },
        ]"
        v-model="assetType"
      />
      <div style="display: flex">
        <Button buttonStyle="background: #fff; color: black" :onClick="() => $router.push({ path: '/wallet/transfer' })">
          <span>Send</span>
          <div spacer style="width: 10px" />
          <img :src="require('../assets/shield_black.svg')" />
        </Button>
        <div spacer style="width: 23px" />
        <Button buttonStyle="background: #fff; color: black" :onClick="() => showingAddressPopup = true">
          <span>Receive</span>
          <div spacer style="width: 10px" />
          <img :src="require('../assets/shield_black.svg')" />
        </Button>
      </div>
      <div style="display: flex">
        <Button :onClick="() => $router.push({ path: '/wallet/deposit' })">
          Top Up
        </Button>
        <div spacer style="width: 23px" />
        <Button>
          Withdraw
        </Button>
      </div>
    </div>
    <div spacer style="height: 32px" />
    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;">
      <!-- search bar and sort options -->
      <div style="position: relative; display: flex; flex: 1">
        <input
          type="text"
          class="search-text-input"
          v-model="filterText"
        />
        <img
          style="position: absolute; left: 7px; top: 10px"
          :src="require('../assets/search_icon.svg')"
          height="25px"
          width="25px"
        />
      </div>
      <div spacer style="width: 16px" />
      <SwitchSelector
        :options="[
          {
            image: require('../assets/sort_row_white.svg'),
            activeColor: 'black',
            inactiveColor: 'white',
          },
          {
            image: require('../assets/sort_grid_black.svg'),
            activeColor: 'black',
            inactiveColor: 'white',
          }
        ]"
        v-model="displayMode"
      />
      <div spacer style="width: 16px" />
      <Button>
        <span>Recently Added</span>
        <div spacer style="width: 10px" />
        <img :src="require('../assets/dropdown.svg')" />
      </Button>
    </div>
    <div spacer style="height: 32px" />
    <div style="display: flex; flex-wrap: wrap; justify-content: center">
      <!-- token table -->
      <AssetCell
        v-for="asset in filteredAssets"
        :symbol="asset"
        :key="asset"
      />
    </div>
    <AddressPopup
      :visible="showingAddressPopup"
      :onCancel="() => showingAddressPopup = false"
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

@Component({
  name: 'Wallet',
  components: { Header, SwitchSelector, Button, AssetCell, ZkopruBackground, AddressPopup, },
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

  mounted() {
    this.filterAssets()
  }

  filterAssets() {
    this.filteredAssets = this.assets.filter((symbol) => {
      return symbol.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1
    })
  }
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding-left: 8px;
  padding-right: 8px;
}
.search-text-input {
  background: #0e2936;
  border-radius: 4px;
  border: 0px solid white;
  color: white;
  font-size: 38px;
  text-indent: 39px;
  flex: 1;
}
.search-text-input:focus {
  border-color: rgba(0, 0, 0, 0);
  border: 0px solid rgba(0, 0, 0, 0);
  outline: 0px solid rgba(0, 0, 0, 0);
}
</style>
