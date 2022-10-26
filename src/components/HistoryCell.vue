<template>
  <div
    :class="`
    history-item-container
    ${isFirst ? 'top' : ''}
    ${isLast ? 'bottom' : ''}
    `"
  >
    <div class="history-item-header">
      {{transaction.proposal ? dayjs(transaction.proposal.timestamp * 1000).format('dddd, MMMM D YYYY') : 'Pending'}}
    </div>
    <div class="history-item-body">
      <div style="display: flex; flex-direction: column; padding: 0px 8px;">
        <ColorImage
          style="margin: 0px 8px"
          :src="iconByType(transaction.type)"
          color="#95A7AE"
        />
      </div>
      <div style="display: flex; flex-direction: column">
        <div v-if="transaction.type === 'Deposit' && transaction.includedIn">
          Deposited from <AddressLink :address="transaction.from" />
        </div>
        <div v-if="transaction.type === 'Deposit' && !transaction.includedIn" style="display: flex; align-items: center">
          <div>Deposit (awaiting block inclusion)</div>
          <div spacer style="width: 4px" />
          <InfoText
            :text="tooltips.PENDING_DEPOSIT_INFO"
          />
        </div>
        <div v-if="transaction.type === 'Withdraw'">
          Withdrawn from <AddressLink :address="transaction.to" />
        </div>
        <div v-if="transaction.type === 'Send'">
          Sent
        </div>
        <div v-if="transaction.type === 'Receive'">
          Received
        </div>
        <div v-if="transaction.type === 'Self'">
          Sent to self
        </div>
        <div v-if="transaction.type === 'PendingDeposit'" style="display: flex; align-items: center">
          <div>Deposit (awaiting commit)</div>
          <div spacer style="width: 4px" />
          <InfoText
            :text="tooltips.PENDING_DEPOSIT_INFO"
          />
        </div>
        <div v-if="transaction.type === 'PendingSend'">
          Sent
        </div>
        <div spacer style="height: 10px" />
        <div style="display: flex; align-items: center; font-size: 11px">
          <div v-if="!!transaction.proposal">
            Completed {{ dayjs(transaction.proposal.timestamp * 1000).format('HH:mm')}}
          </div>
          <div v-if="!!transaction.proposal" style="height: 16px; width: 1px; background: #4C5F67; margin: 0px 8px;" />
          <div>
            Fee {{ fromWei(transaction.fee, 8) }} Eth
          </div>
          <div v-if="transaction.proposal" style="height: 16px; width: 1px; background: #4C5F67; margin: 0px 8px;" />
          <div class="view-more-text" v-if="transaction.proposal" v-on:click="isExpanded = !isExpanded">
            {{ isExpanded ? 'View Less' : 'View More' }}
          </div>
        </div>
        <div v-if="isExpanded" style="display: flex; flex: 1; color: white; padding-top: 16px; font-size: 11px">
          <div style="display: flex; flex-direction: column">
            <div>
              <span class="data-info">Block Hash:</span>
              <span class="data-string">{{ transaction.proposal.hash }}</span>
            </div>
            <div spacer style="height: 8px" />
            <div>
              <span class="data-info">Block Number:</span>
              <span class="data-string">{{ transaction.proposal.canonicalNum }}</span>
            </div>
          </div>
          <div style="height: 100%; width: 1px; background: #4C5F67; margin: 0px 16px;" />
          <div style="display: flex; flex-direction: column">
            <div>
              <span class="data-info">Transaction Hash:</span>
              <span class="data-string">
                <AddressLink :txHash="transaction.proposal.proposalTx" />
              </span>
            </div>
            <div spacer style="height: 8px" />
            <div>
              <span class="data-info">Proposed By:</span>
              <AddressLink class="data-string" :address="transaction.proposal.header.proposer" />
            </div>
          </div>
        </div>
      </div>
      <div style="display: flex; flex: 1" />
      <div style="display: flex; flex-direction: column; padding: 8px; align-items: flex-end">
        <div v-if="transaction.tokenAddr && +transaction.tokenAddr !== 0" style="display: flex">
          <div>{{ formatToken(transaction.erc20Amount, transaction.tokenAddr) }}</div>
          <div spacer style="width: 8px" />
          <img height="18px" :src="tryLoadAssetIcon(tokenSymbol(transaction.tokenAddr))" />
        </div>
        <div v-if="transaction.tokenAddr && +transaction.tokenAddr !== 0 && +transaction.eth > 0" style="height: 4px"></div>
        <div v-if="+transaction.eth > 0 || !transaction.tokenAddr || +transaction.tokenAddr === 0" style="display: flex">
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
import AddressLink from './AddressLink'
import ColorImage from './ColorImage'
import { tryLoadAssetIcon } from '../utils/token'
import InfoText from './InfoText'
import tooltips from '../tooltips'
import BigNumber from 'bignumber.js'

@Component({
  name: 'HistoryCell',
  props: ['transaction', 'isFirst', 'isLast'],
  components: { AddressLink, ColorImage, InfoText, },
})
export default class HistoryCell extends Vue {
  tooltips = tooltips
  dayjs = dayjs
  fromWei = fromWei
  tryLoadAssetIcon = tryLoadAssetIcon

  isExpanded = false

  iconByType(type) {
    if (type === 'Deposit' || type === 'PendingDeposit') {
      return require('../../assets/deposit_icon.svg')
    }
    if (type === 'Withdraw') {
      return require('../../assets/withdraw_icon.svg')
    }
    if (type === 'Send' || type === 'PendingSend') {
      return require('../../assets/send_icon_new.svg')
    }
    if (type === 'Receive') {
      return require('../../assets/receive_icon_new.svg')
    }
  }

  formatToken(amount, tokenAddr) {
    const t = this.$store.state.zkopru.registeredTokens.find((token) => {
      return +token.address === +tokenAddr
    })
    const { decimals, symbol } = t
    const tokenAmount = new BigNumber(amount)
    return `${+tokenAmount.toString() / (10 ** +decimals)} ${symbol}`
  }

  tokenSymbol(tokenAddr) {
    const { symbol } = this.$store.state.zkopru.registeredTokens.find((token) => {
      return +token.address === +tokenAddr
    })
    return symbol
  }
}
</script>

<style scoped>
.history-item-container {
  border-left: 1px solid #3B4E56;
  border-right: 1px solid #3B4E56;
  margin: 0px 8px;
  /* overflow: hidden; */
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
.view-more-text {
  color: #9EFFEE;
  font-size: 11px;
  cursor: pointer;
  user-select: none;
}
.data-info {
  color: #95A7AE;
  margin-right: 4px;
}
.data-string {
  word-break: break-all;
}
</style>
