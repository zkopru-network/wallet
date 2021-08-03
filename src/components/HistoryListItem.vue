<template>
  <div class="container">
    <div class="date">
      {{dateString}}<span style="margin-left: 12px;" :style="{color: isCompleted ? '#9EFFEE' : '#F49F2F' }">{{  isCompleted ? '✓' : '...' }}</span>
    </div>
    <div class="history-body">
      <div class="type-section" style="margin-right: 50px; width: 90px;">
        <img style="margin-right: 12px;" :style="{transform: 'translateY(' + iconPixelToTransform + ')'}" :src="loadIconPath()">
        <span style="color: white;">{{item.type}}</span>
      </div>
      <div class="amount-section">
        <div class="amount-row" style="color: #FFFFFF;">
          <span class="amount-token">
            <img :src="tryLoadAssetIcon()" style="margin-right: 14px; transform: translateY(-4px);"> {{getAssetSymbol()}}
          </span>
          <span class="amount-text">{{amount}}</span>
        </div>
        <div class="amount-row" v-if="item.type==='Deposit' || item.type === 'Withdraw'">
          <span class="amount-token">
            <img :src="require('../../assets/token_icons/ETH.svg')" style="margin-right: 14px; transform: translateY(-4px);"> ETH
          </span>
          <span>{{fee}}</span>
        </div>
      </div>
      <img class="arrow-img" :src="require('../../assets/chevron_left_double_light.svg')">
      <div class="body-item-list">
        <div class="body-item" v-if="item.type === 'Deposit'">
          <span style="margin-bottom: 10px;">Submitted</span>
          <span style="color: #FFFFFF;">{{timeString}}</span>
        </div>
        <div class="body-item">
          <span style="margin-bottom: 10px;">Completed</span>
          <span style="color: #FFFFFF;">{{isCompleted ? 'Complete' : 'Pending'}}</span>
        </div>
        <div class="body-item" v-if="item.type==='Deposit' || item.type==='Withdraw' || item.type ==='Send'">
          <span style="margin-bottom: 10px;">Fee</span>
          <span style="color: #FFFFFF;">ETH {{fee}}</span>
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

@Component({
  name: 'HistoryListItem',
  props: ['item'],
  computed: {
    fee() {
      return fromWei(this.item.fee, 10)
    },
    amount() {
      return fromWei(this.getAmount())
    },
    isCompleted() {
      if (this.item.type === 'Deposit') {
        return this.item.status !== 0
      } else if (this.item.proposal) {
        return this.item.proposal.finalized
      } 
      return false
    },
    dateString() {
      return dayjs.unix(this.item.timestamp).format('MMM D, YYYY')
    },
    timeString() {
      return dayjs.unix(this.item.timestamp).format('h:mm A')
    },
    iconPixelToTransform() {
    if (this.item.type === 'Withdraw' || this.item.type === 'Deposit') {
      return '1px'
    }
      return '-4px'
    }
  }
})
export default class HistoryListItem extends Vue {
  getToken(address) {
    if (+address === 0) {
      return { symbol: 'ETH', address: '0', decimal: 18 }
    }
    return this.$store.state.zkopru.tokensByAddress[address.toLowerCase()] 
  } 
  getAmount() {
    if (this.item.type === 'Deposit' || this.item.type === 'Withdraw') {
      const token = this.getToken(this.item.tokenAddr)
      if (token.symbol === 'ETH') {
        return this.item.eth
      } else {
        return this.item.erc20Amount
      }
    } else {
      return this.item.amount
    }
  }
  loadIconPath() {
    return require(`../../assets/${this.item.type.toLowerCase()}_icon.svg`)
  }
  tryLoadAssetIcon() {
    const token = this.getToken(this.item.tokenAddr)
    try {
      return require(`../../assets/token_icons/${token.symbol.toUpperCase()}.svg`)
    } catch (_) {
      return require('../../assets/token_no_icon.png')
    }
  }
  getAssetSymbol() {
    const token = this.getToken(this.item.tokenAddr)
    return token && token.symbol || 'UNKNOWN'
  }
}
</script>
<style scoped>
.container {
  width: 780px;
  box-shadow: 0px 1px 0px #2a3d46;
  margin-top: 18px;
}
.date {
  font-size: 11px;
  margin-bottom: 18px;
}
.history-body {
  display: flex;
  margin: 24px 0;
  font-size: 14px;
}
.type-section {
  display: flex;
  align-items: flex-start;
}
.amount-section {
  display: flex;
  flex-direction: column;
  width: 160px;
}
.amount-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.amount-row:last-child {
  margin-bottom: 0;
}
.amount-token {
  display: flex;
}
.arrow-img {
  align-self: flex-start;
  margin-left: 32px;
  transform: translateY(-4px);
}
.body-item-list {
  display: flex;
}
.body-item {
  display: flex;
  flex-direction: column;
  font-size: 11px;
  margin-left: 24px;
}
</style>