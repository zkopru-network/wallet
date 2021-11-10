<template>
  <HeaderLeftMenu>
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
          :options="['1w', '4w', '1y', 'Mtd', 'Ytd', 'All']"
          :selectedOption="selectedTimePeriod"
          v-model="selectedTimePeriod"
          style="font-size: 11px"
        />
        <div spacer style="display: flex; flex: 1" />
        <div>
          {{ activeTimePeriod }}
        </div>
      </div>
      <HistoryCell
        v-for="item of history"
        :key="item.hash"
        :transaction="item"
        :isFirst="history.indexOf(item) === 0"
        :isLast="history.indexOf(item) === history.length - 1"
      />
    </div>
  </HeaderLeftMenu>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import LeftMenu from './components/LeftMenu'
import SwitchSelector from './components/SwitchSelector'
import HistoryCell from './components/HistoryCell'
import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import HeaderLeftMenu from './components/HeaderLeftMenu'

dayjs.extend(dayOfYear)

@Component({
  name: 'History',
  components: { LeftMenu, SwitchSelector, HistoryCell, HeaderLeftMenu, }
})
export default class History extends Vue {
  selectedType = 0
  selectedTimePeriod = 0

  get activeTimePeriod() {
    const format = 'MMMM D, YYYY'
    const now = dayjs().format(format)
    if (this.selectedTimePeriod === 0) {
      return `${dayjs().subtract(1, 'week').format(format)} - ${now}`
    }
    if (this.selectedTimePeriod === 1) {
      return `${dayjs().subtract(4, 'week').format(format)} - ${now}`
    }
    if (this.selectedTimePeriod === 2) {
      return `${dayjs().subtract(1, 'year').format(format)} - ${now}`
    }
    if (this.selectedTimePeriod === 3) {
      return `${dayjs().date(1).format(format)} - ${now}`
    }
    if (this.selectedTimePeriod === 4) {
      return `${dayjs().dayOfYear(1).format(format)} - ${now}`
    }
    return `All Time`
  }

  get history() {
    return this.$store.state.zkopru.history.filter(historyItem => {
      if (this.selectedType === 1 && historyItem.type !== 'Send') {
        return false
      }
      if (this.selectedType === 2 && historyItem.type !== 'Receive') {
        return false
      }
      if (this.selectedType === 3 && historyItem.type !== 'Deposit') {
        return false
      }
      if (this.selectedType === 4 && historyItem.type !== 'Withdraw') {
        return false
      }
      const itemTime = historyItem.proposal ? dayjs(historyItem.proposal.timestamp * 1000) : dayjs()
      if (this.selectedTimePeriod === 0 && itemTime.isBefore(dayjs().subtract(1, 'week'))) {
        return false
      }
      if (this.selectedTimePeriod === 1 && itemTime.isBefore(dayjs().subtract(4, 'week'))) {
        return false
      }
      if (this.selectedTimePeriod === 2 && itemTime.isBefore(dayjs().subtract(1, 'year'))) {
        return false
      }
      if (this.selectedTimePeriod === 3 && itemTime.isBefore(dayjs().date(1))) {
        return false
      }
      if (this.selectedTimePeriod === 4 && itemTime.isBefore(dayjs().dayOfYear(1))) {
        return false
      }
      return true
    })
  }
}
</script>
<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  background-color: #05141A;
}
.header-container {
  background: #081B24;
  border-bottom: 1px solid #2A3D46;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 24px;
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
</style>
