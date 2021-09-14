<template>
  <div
    :class="`
    history-item-container
    ${isFirst ? 'top' : ''}
    ${isLast ? 'bottom' : ''}
    `"
  >
    <div class="history-item-header">
      {{transaction.timestamp ? dayjs(transaction.timestamp * 1000).format('dddd, MMMM D YYYY') : 'Pending'}}
    </div>
    <div class="history-item-body">
      <div style="display: flex; flex-direction: column; padding: 0px 8px;">
        <img style="margin: 0px 8px" :src="iconByType(transaction.type)" />
      </div>
      <div style="display: flex; flex-direction: column">
        <div>
          {{ transaction.type === 'Deposit' ? 'Deposited from 0x' : '' }}
          {{ transaction.type === 'Withdraw' ? 'Withdrawn to 0x' : '' }}
        </div>
        <div spacer style="height: 10px" />
        <div style="display: flex; align-items: center">
          <div>
            Completed {{ dayjs(transaction.timestamp * 1000).format('HH:mm')}}
          </div>
          <div style="height: 16px; width: 1px; background: #4C5F67; margin: 0px 8px;" />
          <div>
            Fee {{ fromWei(transaction.fee, 8) }} Eth
          </div>
        </div>
      </div>
      <div style="display: flex; flex: 1" />
      <div style="display: flex; flex-direction: column; padding: 8px; align-items: flex-end">
        <div v-if="+transaction.tokenAddr !== 0" style="display: flex">
          <div>{{ formatToken(transaction.erc20Amount, transaction.tokenAddr) }}</div>
          <div spacer style="width: 8px" />
          <img height="18px" :src="tryLoadAssetIcon(tokenSymbol(transaction.tokenAddr))" />
        </div>
        <div v-if="+transaction.tokenAddr !== 0 && +transaction.eth > 0" style="height: 4px" />
        <div v-if="+transaction.eth > 0 || +transaction.tokenAddr === 0" style="display: flex">
          <div>{{ fromWei(transaction.eth) }} ETH</div>
          <div spacer style="width: 8px" />
          <img height="18px" :src="tryLoadAssetIcon('ETH')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import dayjs from 'dayjs'
import { fromWei } from '../utils/wei'
import BN from 'bn.js'

@Component({
  name: 'HistoryCell',
  props: ['transaction', 'isFirst', 'isLast']
})
export default class HistoryCell extends Vue {
  dayjs = dayjs
  fromWei = fromWei

  iconByType(type) {
    if (type === 'Deposit') {
      return require('../../assets/deposit_icon.svg')
    }
    if (type === 'Withdraw') {
      return require('../../assets/withdraw_icon.svg')
    }
  }

  formatToken(amount, tokenAddr) {
    const { address, decimals, symbol } = this.$store.state.zkopru.registeredTokens.find((token) => {
      return +token.address === +tokenAddr
    })
    const tokenAmount = new BN(amount)
    return `${+tokenAmount.toString() / (10 ** +decimals)} ${symbol}`
  }

  tokenSymbol(tokenAddr) {
    const { symbol } = this.$store.state.zkopru.registeredTokens.find((token) => {
      return +token.address === +tokenAddr
    })
    return symbol
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
.history-item-container {
  border-left: 1px solid #3B4E56;
  border-right: 1px solid #3B4E56;
  margin: 0px 8px;
  overflow: hidden;
}
.history-item-container.top {
  border-top: 1px solid #3B4E56;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.history-item-container.bottom {
  border-bottom: 1px solid #3B4E56;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.history-item-header {
  background-color: #192C35;
  color: #F2F2F2;
  font-size: 14px;
  padding: 8px;
}
.history-item-body {
  display: flex;
  color: white;
  padding: 16px 0px;
}
</style>
