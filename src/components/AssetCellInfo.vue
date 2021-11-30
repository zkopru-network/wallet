<template>
  <div class="asset-cell-info-container">
    <div style="font-weight: bold; white-space: nowrap;">
      {{ title }}
    </div>
    <div style="padding: 0px 4px">
      -
    </div>
    <div>{{ text }}</div>
    <div spacer style="width: 16px" />
    <div style="cursor: pointer; user-select: none" v-on:click="close">
      <img :src="require('../../assets/close_circle_icon.svg')" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'AssetCellInfo',
  props: ['title', 'text', 'onClose'],
})
export default class AssetCellInfo extends Vue {
  close() {
    if (typeof this.onClose === 'function') {
      this.onClose()
    }
  }
}
</script>

<style scoped>
.asset-cell-info-container {
  background: #05141A;
  border: 1px solid #2A3D46;
  border-radius: 8px;
  font-size: 11px;
  color: #F2F2F2;
  padding: 11px 16px;
  display: flex;
  align-items: center;
}
</style>
