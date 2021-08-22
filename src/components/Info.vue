<template>
  <div
    style="position: relative"
  >
    <div
      v-on:mouseenter="showingPopup = true"
      v-on:mouseleave="showingPopup = false"
    >
      <img :src="image || require('../../assets/info_icon.svg')" />
    </div>
    <div v-if="showingPopup" class="info-popup">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'Info',
  props: ['image']
})
export default class Info extends Vue {
  showingPopup = false
}
</script>
<style scoped>
.info-popup {
  position: absolute;
  color: white;
  background: black;
  padding: 8px;
  min-width: 150px;
  max-width: 250px;
  z-index: 100;
}
</style>
