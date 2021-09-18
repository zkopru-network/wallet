<template>
  <div :class="`sync-indicator-container ${syncing ? 'animated' : ''}`">
    {{ $store.state.zkopru.syncing ? $store.state.zkopru.status : 'Not synchronizing' }} - {{$store.state.zkopru.syncPercent}}%
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'SyncIndicator',
  computed: {
    syncing() {
      if (!this.$store.state.zkopru.syncing) return false
      if (this.$store.state.zkopru.status === 'Fully synced') return false
      return true
    }
  }
})
export default class SyncIndicator extends Vue {}
</script>

<style scoped>
.sync-indicator-container {
  background: #192C35;
  padding: 16px 8px;
  color: white;
  border-bottom: 1px solid #00FFD1;
}
.sync-indicator-container.animated {
  animation: border-color-anim 1s infinite linear;
}
@keyframes border-color-anim {
  0% {
    border-color: #00FFD1;
  }
  50% {
    border-color: #F49F2F;
  }
  100% {
    border-color: #00FFD1;
  }
}
</style>
