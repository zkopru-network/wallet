<template>
  <div class="grow-container">
    <div class="asset-dropdown-container" v-on:click="false && (dropdownVisible = !dropdownVisible)">
      <div style="display: flex; align-items: center">
        <img :src="require('../../assets/token_icons/CRO.svg')" />
        <div spacer style="width: 23px" />
        <span class="asset-symbol-text">CRO</span> 0.10000000000000009 | USD $280.00
      </div>
      <div spacer style="display: flex; flex: 1" />
      <img :src="require('../../assets/asset_dropdown.svg')" />
      <div v-if="dropdownVisible" class="asset-dropdown">
        test
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'AssetDropdown',
  props: ['selectedAsset']
})
export default class AssetDropdown extends Vue {
  dropdownVisible = false
  assets = ['CRO', 'DAI']
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
  background-color: #0E2936;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  max-width: 462px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 23px;
  align-self: center;
  font-size: 12px;
  cursor: pointer;
  flex: 1;
  user-select: none;
}
.asset-symbol-text {
  color: #00FFD1;
}
.asset-dropdown {
  position: absolute;
}
</style>
