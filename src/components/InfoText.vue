<template>
  <div
    style="position: relative"
  >
    <div
      v-on:mouseenter="showingPopup = true"
      v-on:mouseleave="showingPopup = false"
    >
      <img :src="require('../../assets/info_question.svg')" />
    </div>
    <div v-if="showingPopup" class="info-popup">
      {{ text }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'InfoText',
  props: ['text']
})
export default class InfoText extends Vue {
  showingPopup = false
}
</script>

<style scoped>
.info-popup {
  position: absolute;
  font-size: 12px;
  font-weight: normal;
  border-radius: 8px;
  white-space: nowrap;
  color: #F2F2F2;
  background: #05141A;
  border: 1px solid #5D7078;
  padding: 8px;
  /* min-width: 150px; */
  max-width: 250px;
  z-index: 100;
}
</style>
