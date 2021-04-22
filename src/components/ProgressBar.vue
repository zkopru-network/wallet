<template>
  <div style="display: flex; align-items: center; height: 8px">
    <div style="margin: 4px; height: 8px; position: relative; width: 100%">
      <div class="progress-inactive" />
      <div class="progress-active" :style="`width: ${percent}%`" />
    </div>
    <div class="percent-text" v-if="showPercent">
      {{ Math.ceil(+percent) }}%
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'ProgressBar',
  props: [ 'percent', 'showPercent', ],
})
export default class ProgressBar extends Vue {}
</script>

<style scoped>
.progress-active {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  background-color: #D0FFF7;
  border-radius: 8px;
}
.progress-inactive {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  background-color: #5D7078;
  border-radius: 8px;
}
.percent-text {
  color: white;
  font-size: 16px;
  margin-left: 4px;
}
</style>
