<template>
  <div class="cell-container">
    <div style="cursor: pointer;" v-on:click="transfer">
      <ColorImage color="#A2EFE1" :src="require('../../assets/send_icon_new.svg')" />
    </div>
    <div spacer style="width: 10px" />
    <img
      :src="tryLoadAssetIcon(symbol)"
      width="24px"
      height="24px"
      style="object-fit: contain; "
    />
    <div spacer style="width: 10px" />
    <div class="cell-text" style="min-width: 40px">
      {{ symbol.toUpperCase() }}
    </div>
    <div spacer style="width: 10px" />
    <div class="cell-text">
      {{balance(symbol)}}
    </div>
    <div spacer style="width: 10px" />
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
    <div spacer style="width: 10px" />
    <AssetCellInfo
      title="No ETH"
      text="ETH is used to cover coordinator fees on the Zkopru network. Deposit ETH to make your first transaction."
      :onClose="() => showingInfo = false"
      v-if="showingInfo && symbol.toUpperCase() === 'ETH' && +$store.state.zkopru.balance === 0 && $store.state.zkopru.l2BalanceLoaded"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Button from './Button'
import Info from './Info'
import ColorImage from './ColorImage'
import { tryLoadAssetIcon } from '../utils/token'
import AssetCellInfo from './AssetCellInfo'

@Component({
  name: 'AssetCell',
  props: ['symbol', 'tokenAddr'],
  components: { Button, Info, ColorImage, AssetCellInfo, },
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
  tryLoadAssetIcon = tryLoadAssetIcon
  showingInfo = true

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
}
</script>
<style scoped>
.cell-container {
  user-select: none;
  display: flex;
  padding: 16px 8px;
  margin: 8px 8px;
  align-items: center;
  border-bottom: 1px solid #2A3D46;
}
.cell-text {
  font-size: 14px;
  color: white;
}
</style>
