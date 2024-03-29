<template>
  <div class="grow-container">
    <div
      :class="`asset-dropdown-container ${dropdownVisible ? 'active' : ''}`"
      v-on:click="dropdownClicked"
    >
      <div v-if="!!activeAsset" style="display: flex; align-items: center">
        <img
          v-show="showIcon"
          :src="tryLoadAssetIcon(activeAsset)"
          width="23px"
          height="23px"
        />
        <div spacer v-show="showIcon" style="width: 23px" />
        <span class="asset-symbol-text">{{activeAsset.toUpperCase()}}</span>
        <div spacer style="width: 8px" />
        {{balanceText(activeAsset)}}
      </div>
      <div v-if="!activeAsset" style="display: flex; align-items: center">
        Select a token
      </div>
      <div spacer style="display: flex; flex: 1" />
      <img v-show="editable" :src="require('../../assets/asset_dropdown.svg')" />
      <div v-if="dropdownVisible" class="asset-dropdown">
        <input
          type="text"
          class="dropdown-search"
          ref="search"
          v-on:click="searchFieldClick"
          placeholder="search"
          v-model="searchText"
        />
        <ColorImage
          style="position: absolute; left: 24px; top: 10px"
          color="#2A3D46"
          :src="require('../../assets/search_icon.svg')"
          height="16px"
          width="16px"
        />
        <div class="asset-dropdown-scroll-container">
          <div
            v-for="(asset, index) of (searchText ? filteredAssets : assets)"
            :class="`asset-dropdown-row ${asset === highlightedAsset ? 'active' : ''}`"
            :style="index === (searchText ? filteredAssets : assets).length - 1 ? 'border-bottom-left-radius: 8px; border-bottom-right-radius: 8px' : ''"
            v-on:mouseenter="highlightedAsset = asset"
            v-on:mouseleave="highlightedAsset = ''"
            v-on:click="selectAsset(asset)"
          >
            <img
              :src="tryLoadAssetIcon(asset)"
              width="23px"
              height="23px"
            />
            <div spacer style="width: 23px" />
            <span class="asset-symbol-text">{{asset.toUpperCase()}}</span>
            <div spacer style="width: 8px" />
            {{balanceText(asset)}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ColorImage from './ColorImage'

@Component({
  name: 'AssetDropdown',
  components: { ColorImage, },
  props: {
    activeAsset: {
      type: String,
      default: 'ETH',
    },
    loadBalance: {
      type: Function,
      required: false,
    },
    editable: {
      type: Boolean,
      required: false,
      default: true,
    },
    showIcon: {
      type: Boolean,
      required: false,
      default: true,
    },
    tokenOnly: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  computed: {
    assets() {
      const tokens = this.$store.state.zkopru.registeredTokens.map(({ symbol }) => symbol)
      if (this.tokenOnly) {
        return tokens
      } else {
        return ['ETH', ...tokens]
      }
    }
  },
  watch: {
    searchText() {
      this.filterAssets()
    },
    assets() {
      this.filterAssets()
    }
  },
  model: {
    prop: 'activeAsset',
    event: 'assetChanged',
  }
})
export default class AssetDropdown extends Vue {
  dropdownVisible = false
  searchText = ''
  filteredAssets = []
  // activeAsset =  'ETH'
  highlightedAsset = ''

  mounted() {
    this.filterAssets()
  }

  selectAsset(asset) {
    this.$emit('assetChanged', asset)
  }

  filterAssets() {
    this.filteredAssets = this.assets.filter(name => {
      if (this.tokenOnly && name.toUpperCase() === 'ETH') return false
      return name.toLowerCase().indexOf(this.searchText.toLowerCase()) !== -1
    })
  }

  dropdownClicked() {
    if (!this.editable) return
    this.dropdownVisible = !this.dropdownVisible
    if (this.dropdownVisible) {
      this.searchText = ''
      this.highlightedAsset = ''
      Vue.nextTick(() => this.$refs.search.focus())
    }
  }

  searchFieldClick(e) {
    e.stopPropagation()
    this.$refs.search.focus()
  }

  balanceText(symbol) {
    if (typeof this.loadBalance === 'function') {
      return this.loadBalance(symbol)
    }
    if (symbol.toUpperCase() === 'ETH') {
      return `${this.$store.state.zkopru.balance || '0'} | USD $0`
    }
    const tokenBalance = this.$store.state.zkopru.tokenBalances[symbol.toUpperCase()]
    return `${tokenBalance || '0'} | USD $0`
  }

  tryLoadAssetIcon(symbol) {
    try {
      return require(`../../assets/token_icons/${symbol.toUpperCase()}.svg`)
    } catch (_) {
      return require('../../assets/token_no_icon.png')
    }
  }
}
</script>
<style scoped>
.grow-container {
  display: flex;
  width: 100%;
  justify-content: center;
}
.asset-dropdown-container {
  position: relative;
  background-color: #192C35;
  border-radius: 8px;
  max-width: 543px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px;
  align-self: center;
  font-size: 14px;
  cursor: pointer;
  flex: 1;
  user-select: none;
  border: 1px solid transparent;
  border-bottom: 0px solid #3B4E56;
}
.asset-dropdown-container.active {
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  border: 1px solid #3B4E56;
  border-bottom: 0px solid #3B4E56;
}
.asset-symbol-text {
  color: #00FFD1;
}
.asset-dropdown {
  position: absolute;
  top: 100%;
  /* -1px to account for 1px border */
  left: -1px;
  right: -1px;
  border: 1px solid #3B4E56;
  border-top: 0px solid #3B4E56;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  z-index: 10;
}
.asset-dropdown-scroll-container {
  max-height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.dropdown-search {
  height: 33px;
  background-color: #000;
  outline: 0px;
  border: 0px;
  color: white;
  width: calc(100% - 50px);
  padding: 0px;
  padding-left: 50px;
}
.dropdown-search:focus {
  outline: 0px;
  border: 0px;
}
.dropdown-search::placeholder {
  color: #2A3D46;
}
.asset-dropdown-row {
  background-color: #081B24;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  width: calc(100% - 13px - 13px);
  padding: 13px;
}
.asset-dropdown-row.active {
  background-color: #192C35;
}
.asset-dropdown-footer {
  background-color: #192C35;
  color: white;
  font-size: 14px;
  display: flex;
  align-items: center;
  width: calc(100% - 23px - 23px);
  padding: 6px 23px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>
