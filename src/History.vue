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
      <HistoryCell
        v-for="item of history"
        :transaction="item"
        :isFirst="history.indexOf(item) === 0"
        :isLast="history.indexOf(item) === history.length - 1"
      />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import LeftMenu from './components/LeftMenu'
import SwitchSelector from './components/SwitchSelector'
import HistoryCell from './components/HistoryCell'

@Component({
  name: 'History',
  components: { LeftMenu, SwitchSelector, HistoryCell }
})
export default class History extends Vue {
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
</style>
