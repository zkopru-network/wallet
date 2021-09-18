<template>
  <div class="container">
    <LeftMenu />
    <div class="body-container">
      <HeaderSection />
      <div class="header-container">
        <div style="color: white; border-bottom: 1px solid #9EFFEE; padding-bottom: 4px">Tokens registered with Zkopru</div>
        <div class="round-button" v-on:click="showingAddPopup = true">Register Token</div>
      </div>
      <div style="padding: 16px">
        <SearchField v-model="searchText" />
      </div>
      <div
        class="token-row"
        v-for="token of filteredAssets"
      >
        <div style="cursor: pointer" v-on:click="addToken(token)">
          <ColorImage
            :src="require('../assets/add_icon.svg')"
            :color="true ? '#9EFFEE' : '#95A7AE'"
          />
        </div>
        <div spacer style="width: 10px" />
        <img :src="tryLoadAssetIcon(token.symbol)" />
        <div spacer style="width: 10px" />
        <div>{{ token.symbol }}</div>
        <div spacer style="width: 10px" />
      </div>
    </div>
    <AddTokenPopup v-if="showingAddPopup" :onCancel="() => showingAddPopup = false" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import LeftMenu from './components/LeftMenu'
import ColorImage from './components/ColorImage'
import AddTokenPopup from './components/AddTokenPopup'
import { tryLoadAssetIcon } from './utils/token'
import HeaderSection from './components/HeaderSection'
import SearchField from './components/SearchField'

@Component({
  name: 'Library',
  components: { LeftMenu, ColorImage, AddTokenPopup, HeaderSection, SearchField, },
  watch: {
    searchText() {
      this.filterAssets()
    },
    assets() {
      this.filterAssets()
    }
  },
  computed: {
    assets() {
      return [...this.$store.state.zkopru.registeredTokens]
    }
  }
})
export default class Library extends Vue {
  tryLoadAssetIcon = tryLoadAssetIcon
  showingAddPopup = false
  searchText = ''
  filteredAssets = []

  filterAssets() {
    this.filteredAssets = this.assets.filter(({ symbol }) => {
      return symbol.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1
    })
  }

  addToken(token) {
    this.$router.push(`/wallet/deposit?type=2&asset=${token.symbol}`)
  }
}
</script>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
}
.body-container {
  flex: 1;
  bottom: 0px;
}
.header-container {
  border-top: 1px solid #2A3D46;
  border-bottom: 1px solid #2A3D46;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  font-size: 16px;
}
.round-button {
  background: #A2EFE1;
  border-radius: 20px;
  color: black;
  padding: 4px 24px;
  cursor: pointer;
  user-select: none;
}
.token-row {
  display: flex;
  align-items: center;
  margin: 0px 16px;
  padding: 16px 0px;
  box-shadow: 0px 1px 0px #2A3D46;
  color: white;
}
</style>
