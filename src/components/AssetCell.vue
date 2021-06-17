<template>
  <div class="cell-container" v-on:click="deposit">
    <div style="display: flex; justify-content: flex-end">
      <div style="cursor: pointer" v-on:click="deposit">
        <img :src="require('../../assets/top_up.svg')" />
      </div>
    </div>
    <div style="display: flex; align-items: center; justify-content: center;">
      <img
        :src="tryLoadAssetIcon(symbol)"
        width="93px"
        height="93px"
        style="background-color: white; border-radius: 50%; object-fit: contain; border: 1px solid black"
      />
    </div>
    <div spacer style="height: 23px" />
    <div style="display: flex; justify-content: space-between" class="cell-text">
      <div>
        {{balance(symbol)}}
      </div>
      <div>
        {{ symbol.toUpperCase() }}
      </div>
    </div>
    <div style="align-self: center; color: rgba(150, 150, 150, 0.65)" class="cell-text">
      ---------------------
    </div>
    <div style="display: flex; justify-content: space-between" class="cell-text">
      <div>
        0
      </div>
      <div>
        USD
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Button from './Button'
@Component({
  name: 'AssetCell',
  props: ['symbol'],
  components: { Button, },
})
export default class AssetCell extends Vue {
  transfer() {
    this.$router.push({ path: `/wallet/transfer?asset=${this.symbol}` })
  }

  deposit() {
    this.$router.push({ path: `/wallet/deposit?asset=${this.symbol}` })
  }

  balance(symbol) {
    if (symbol.toUpperCase() === 'ETH') {
      return this.$store.state.zkopru.balance || '0'
    }
    const tokenBalance = this.$store.state.zkopru.tokenBalances[symbol.toUpperCase()]
    return tokenBalance || '0'
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
.cell-container {
  user-select: none;
  background: #0e2936;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 288px;
  height: 288px;
  padding: 10px;
  margin: 13px;
  cursor: pointer;
}
.cell-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
}
</style>
