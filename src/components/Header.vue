<template>
  <div class="header-container">
    <div style="display: flex; align-items: center">
      <div class="header-title-text">
        zkopru wallet
      </div>
      <div spacer style="width: 17px" />
      <img src="../../assets/settings_cog.svg" />
    </div>
    <div style="display: flex; align-items: center">
      <!-- progress bar and stuff -->
      <div style="color: white">
        {{ $store.state.zkopru.syncing ? syncStatus : 'Not synchronizing' }}
      </div>
      <ProgressBar :percent="$store.state.zkopru.syncPercent" :showPercent="true" style="width: 240px" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ProgressBar from './ProgressBar'

@Component({
  name: 'Header',
  components: { ProgressBar, },
})
export default class Header extends Vue {
  syncStatus = 'Checking validity using L1Provider'
  mounted() {
    setInterval( () => {
    console.log(this.$store.getters)
  }, 5000)
  }
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  padding: 24px;
}
.header-title-text {
  font-weight: bold;
  font-size: 32px;
  color: #D0FFF7;
}
</style>
