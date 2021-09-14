<template>
  <div class="container">
    <LeftMenu />
    <div class="body-container">
      <div class="header-container">
        <SwitchSelector
          :options="['All', 'Sent', 'Received', 'Deposited', 'Withdrawn']"
          :selectedOption="selectedType"
          v-model="selectedType"
        />
      </div>
      <div class="subheader-container">
        <SwitchSelector
          :options="['1w', '4w', '1y', 'Mtd', 'Qtd', 'Ytd', 'All']"
          :selectedOption="selectedTimePeriod"
          v-model="selectedTimePeriod"
          style="font-size: 11px"
        />
        <div spacer style="display: flex; flex: 1" />
        <div>
          August 1, 2021 - August 31, 2021
        </div>
      </div>
      <div
        v-for="item of history"
        :class="`
        history-item-container
        ${history.indexOf(item) === 0 ? 'top' : ''}
        ${history.indexOf(item) === history.length - 1 ? 'bottom' : ''}
        `"
      >
        <div class="history-item-header">
          {{item.timestamp ? dayjs(item.timestamp * 1000).format('dddd, MMMM D YYYY') : 'Pending'}}
        </div>
        <div class="history-item-body">
          <div style="display: flex; flex-direction: column; padding: 0px 8px;">
            <img style="margin: 0px 8px" :src="iconByType(item.type)" />
          </div>
          <div style="display: flex; flex-direction: column">
            <div>
              {{ item.type === 'Deposit' ? 'Deposited from 0x' : '' }}
              {{ item.type === 'Withdraw' ? 'Withdrawn to 0x' : '' }}
            </div>
            <div spacer style="height: 10px" />
            <div style="display: flex; align-items: center">
              <div>
                Completed {{ dayjs(item.timestamp * 1000).format('HH:mm')}}
              </div>
              <div style="height: 16px; width: 1px; background: #4C5F67; margin: 0px 8px;" />
              <div>
                Fee {{ fromWei(item.fee, 8) }} Eth
              </div>
            </div>
          </div>
          <div style="display: flex; flex: 1" />
          <div style="display: flex; flex-direction: column; padding: 8px; align-items: flex-end">
            <div v-if="+item.tokenAddr !== 0" style="display: flex">
              <div>{{ formatToken(item.erc20Amount, item.tokenAddr) }}</div>
              <div spacer style="width: 8px" />
              <img height="18px" :src="tryLoadAssetIcon(tokenSymbol(item.tokenAddr))" />
            </div>
            <div v-if="+item.tokenAddr !== 0 && +item.eth > 0" style="height: 4px" />
            <div v-if="+item.eth > 0 || +item.tokenAddr === 0" style="display: flex">
              <div>{{ fromWei(item.eth) }} ETH</div>
              <div spacer style="width: 8px" />
              <img height="18px" :src="tryLoadAssetIcon('ETH')" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import dayjs from 'dayjs'
import Header from './components/Header'
import Button from './components/Button'
import HistoryListItem from './components/HistoryListItem.vue'
import LeftMenu from './components/LeftMenu'
import SwitchSelector from './components/SwitchSelector'
import { fromWei } from './utils/wei'
import BN from 'bn.js'

@Component({
  name: 'History',
  components: { Header, Button, HistoryListItem, LeftMenu, SwitchSelector }
})
export default class History extends Vue {
  dayjs = dayjs
  fromWei = fromWei
  selectedType = 0
  selectedTimePeriod = 0

  get history() {
    return this.$store.state.zkopru.history.filter(historyItem => {
      return historyItem
    })
  }

  async mounted() {
    await new Promise(r => setTimeout(r, 5000))
    await this.startLoadHistory()
    console.log(this.history)
  }

  startLoadHistory() {
    return this.$store.dispatch('loadHistory')
  }

  formatMonth(month) {
    return dayjs().month(month).format('MMMM')
  }

  iconByType(type) {
    if (type === 'Deposit') {
      return require('../assets/deposit_icon.svg')
    }
    if (type === 'Withdraw') {
      return require('../assets/withdraw_icon.svg')
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
      return require(`../assets/token_icons/${symbol.toUpperCase()}.svg`)
    } catch (_) {
      return require('../assets/token_no_icon.png')
    }
  }
}
</script>
<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #05141A;
}
.header-container {
  background: #081B24;
  border-top: 1px solid #2A3D46;
  border-bottom: 1px solid #2A3D46;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 32px 24px;
  font-size: 16px;
}
.subheader-container {
  display: flex;
  flex: 1;
  align-items: center;
  color: white;
  padding: 25px 12px;
  font-size: 11px;
}
.body-container {
  background: #081B24;
  flex: 1;
  bottom: 0px;
}
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
