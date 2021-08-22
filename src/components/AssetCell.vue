<template>
  <div class="cell-container">
    <div style="position: relative; background-color: #05141A; border-radius: 50%; width: 67px; height: 67px; display: flex; justify-content: center; align-items: center">
      <img
        :src="tryLoadAssetIcon(symbol)"
        width="32px"
        height="32px"
        style="object-fit: contain; "
        />
        <div
          style="cursor: pointer; user-select:none; position: absolute; width: 32px; height: 32px; bottom: 0px; right: -12px; border-radius: 50%; background: #A2EFE1; display: flex; justify-content: center; align-items: center"
          v-on:click="transfer"
        >
          <img :src="require('../../assets/send_button_icon.svg')" width='16px' height='16px' />
        </div>
      </div>
    <div spacer style="width: 120px" />
    <div style="display: flex; flex-direction: column">
      <div style="color: white; font-size: 14px;">
        {{balance(symbol)}}
        {{ symbol.toUpperCase() }}
      </div>
      <div spacer style="height: 5px" />
      <div style="width: 100%; height: 1px; background-color: #2A3D46" />
      <div spacer style="height: 5px" />
      <div style="font-size: 11px; color:#95A7AE; text-align: right">
        0 USD
      </div>
    </div>
    <Info style="margin-left: 8px">
      <div style="display: flex; flex-direction: column">
        <div>
          Total Notes: {{ noteCount }}
        </div>
        <div>
          Max Spend: {{ maxSpend }}
        </div>
      </div>
    </Info>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Button from './Button'
import Info from './Info'
@Component({
  name: 'AssetCell',
  props: ['symbol', 'tokenAddr'],
  components: { Button, Info },
  computed: {
    maxSpend: function() {
      const info = this.$store.state.zkopru.noteInfo[this.symbol]
      if (!info) return 0
      return info.maxSpendDecimal
    },
    noteCount: function() {
      const info = this.$store.state.zkopru.noteInfo[this.symbol]
      if (!info) return 0
      return info.count
    }
  }
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
  background: #192C35;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  display: flex;
  height: 83px;
  padding: 8px 16px;
  margin: 13px;
  justify-content: center;
  align-items: center;
}
.cell-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
}
</style>
