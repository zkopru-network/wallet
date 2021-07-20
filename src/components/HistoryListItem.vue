<template>
	<div class="container">
		<div class="date">
			{{dateString}}<span style="margin-left: 12px;" v-bind:style="{color: isPending ? '#F49F2F' : '#9EFFEE'}">{{  isPending ? '...' : '✓' }}</span>
		</div>
		<div class="history-body">
			<div style="margin-right: 50px;">
				<img style="margin-right: 12px; transform: translateY(2px);" :src="require('../../assets/deposit_icon.svg')"><span>{{item.type}}</span>
			</div>
			<div class="amount-section">
				<div class="amount-row" style="color: #FFFFFF;">
					<span class="amount-token">
						<img :src="require('../../assets/token_icons/ETH.svg')" style="margin-right: 14px; transform: translateY(-4px);"> ETH
					</span>
					<span class="amount-text">{{amount}}</span>
				</div>
				<div class="amount-row">
					<span class="amount-token">
						<img :src="require('../../assets/token_icons/ETH.svg')" style="margin-right: 14px; transform: translateY(-4px);"> ETH
					</span>
					<span style="width: 105px;">{{fee}}</span>
				</div>
			</div>
			<img class="arrow-img" :src="require('../../assets/chevron_left_double_light.svg')">
			<div class="body-item-list">
				<div class="body-item">
					<span style="margin-bottom: 10px;">Submitted</span>
					<span style="color: #FFFFFF;">{{timeString}}</span>
				</div>
				<div class="body-item">
					<span style="margin-bottom: 10px;">Completed</span>
					<span style="color: #FFFFFF;">{{isPending ? 'Pending' : 'Complete'}}</span>
				</div>
				<div class="body-item">
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
			return fromWei(this.item.fee)
		},
		amount() {
			return fromWei(this.getAmount())
		},
		isPending() {
			if (this.item.type === 'DEPOSIT') {
				return this.item.status === 0
			} else {
				return this.item.status === 0 || this.item.status === 3
			}
		},
		dateString() {
			return dayjs.unix(this.item.timestamp).format('MMM D, YYYY')
		},
		timeString() {
			return dayjs.unix(this.item.timestamp).format('h:mm A')
		}
	}
})
export default class HistoryListItem extends Vue {
	getTokens(address) {
		const tokens = [
			{symbol: 'ETH', address: '0', decimal: 18},
			...this.$store.state.zkopru.registeredTokens
		]
		return tokens.find(token => token.address === address)
	}
	getAmount() {
		const token = this.getTokens(this.item.tokenAddr)
		if (token.symbol === 'ETH') {
			return this.item.eth
		} else {
			return this.item.erc20Amount
		}
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
.amount-section {
	display: flex;
	flex-direction: column;
}
.amount-row {
	display: flex;
	margin-bottom: 24px;
}
.amount-row:last-child {
	margin-bottom: 0;
}
.amount-token {
	display: flex;
	margin-right: 40px;
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