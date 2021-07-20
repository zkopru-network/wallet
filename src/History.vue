<template>
  <div class="container">
		<Header showBackButton=true prevPath="/wallet" />
		<h2 class="title">Transaction History</h2>
		<div class="body-container">
			<div class="period-picker">
				<div class="month-picker">
					<div class="picker-button" @click="console.log('may')">
						May
					</div>
					<div class="picker-button" @click="console.log('may')">
						June
					</div>
				</div>
				<div class="year-picker">
					<div class="picker-button">2021</div>
				</div>
			</div>
			<div>
				<HistoryListItem
					v-for="historyItem in history"
					:item="historyItem"
					:key="historyItem.hash"
				/>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Header from './components/Header'
import Button from './components/Button'
import HistoryListItem from './components/HistoryListItem.vue'

@Component({
	name: 'History',
	components: { Header, Button, HistoryListItem },
	computed: {
		history() {
			return this.$store.state.zkopru.history
		}
	}
})
export default class History extends Vue {
	startLoadHistory() {
		this.$store.dispatch('loadHistory')
	}
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
	justify-content: center;
  flex: 1;
  padding-left: 8px;
  padding-right: 8px;
  color: #95A7AE;
}
.body-container {
	width: 80%;
	max-width: 1320px;
	margin: auto;
	display: flex;
	justify-content: space-between;
}
.title {
	width: 80%;
	max-width: 1320px;
	margin-top: 72px;
	padding-left: 132px;
	padding-bottom: 7px;
	color: #F2F2F2;
	font-size: 12px;
	box-shadow: 0px 1px 0px #2a3d46;
	align-self: center;
}
.period-picker {
	padding-left: 66px;
}
.month-picker {
	margin-top: 64px;
	max-height: 120px;
	overflow: scroll;
}
.year-picker {
	margin-top: 64px;
	max-height: 120px;
	overflow: scroll;
}
.picker-button {
  background: #A2EFE1;
  border-radius: 20px;
  color: black;
  font-size: 16px;
  padding: 8px 36px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>