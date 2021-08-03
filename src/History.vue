<template>
  <div class="container">
    <Header showBackButton=true prevPath="/wallet" />
    <h2 class="title">Transaction History</h2>
    <div class="body-container">
      <div class="period-picker">
        <div class="month-picker">
          <div 
            v-for="month in months(selectedYear)"
            :key="month"
            class="picker-button"
            :class="{selected: selectedMonth === month}"
            @click="selectMonth(month)">
            {{formatMonth(month)}}
          </div>
        </div>
        <div class="year-picker">
          <div
            v-for="year in years"
            :key="year"
            class="picker-button"
            :class="{selected: selectedYear === year}"
            @click="selectYear(year)"
          >{{year}}</div>
        </div>
      </div>
      <div style="width: 80%;">
        <HistoryListItem
          v-for="historyItem in history"
          :item="historyItem"
          :key="historyItem.hash + historyItem.type"
        />
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

@Component({
  name: 'History',
  components: { Header, Button, HistoryListItem }
})
export default class History extends Vue {
  // set initial value to today
  selectedYear = dayjs().year()
  selectedMonth = dayjs().month()

  get history() {
    return this.$store.state.zkopru.history.filter(historyItem => {
      return dayjs.unix(historyItem.timestamp).isSame(`${this.selectedYear}-${this.selectedMonth+1}-01`, 'month')
    })
  }

  get years() {
    const history = this.$store.state.zkopru.history
    if (history.length === 0) return []

    const oldest = dayjs.unix(history[history.length-1].timestamp).year()
    const latest = dayjs.unix(history[0].timestamp).year()
    const years = []
    for (let i = oldest; i <= latest; i++) {
      years.push(i)
    }
    return years
  }

  months(year) {
    const history = this.$store.state.zkopru.history
    if (history.length === 0) return []

    const oldest = dayjs.unix(history[history.length-1].timestamp)
    const latest = dayjs.unix(history[0].timestamp)

    if (latest.year() === oldest.year()) {
      if (year !== latest.year()) {
        throw new Error('cannot be reached')
      }
      const months = []
      for (let i = oldest.month(); i <= latest.month(); i++) {
        months.push(i)
      }
      return months
    }

    if (year === latest.year()) {
      for (let i = 0; i <= latest.month(); i++) {
        months.push(i)
      }
      return months
    } else if (year === oldest.year()) {
      for (let i = oldest.month(); i <= 11; i++) {
        months.push(i)
      }
      return months
    }

    return [...new Array(0, 12)].map((_, i) => i)
  }

  startLoadHistory() {
    this.$store.dispatch('loadHistory')
  }

  selectYear(year) {
    this.selectedYear = year
    const months = this.months(year)
    this.selectedMonth = months[months.length - 1]
  }

  selectMonth(month) {
    this.selectedMonth = month
  }

  formatMonth(month) {
    return dayjs().month(month).format('MMMM')
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
  overflow-y: scroll;
}
.year-picker {
  margin-top: 64px;
  max-height: 120px;
  overflow-y: scroll;
}
.picker-button {
  background: #3F6767;
  border-radius: 20px;
  color: black;
  font-size: 16px;
  padding: 8px 36px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 16px;
}
.picker-button.selected {
  background: #A2EFE1;
}
</style>