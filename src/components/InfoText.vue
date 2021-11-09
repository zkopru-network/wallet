<template>
  <div
    style="position: relative"
    ref="containerEl"
  >
    <div
      v-on:mouseenter="showingPopup = true"
      v-on:mouseleave="showingPopup = false"
    >
      <img width="18px" height="auto" :src="require('../../assets/info_question.svg')" />
    </div>
    <div
      v-if="showingPopup"
      class="info-popup"
      :style="`width: ${textWidth}; left: -${textOffsetLeft}px`"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import measureText from '../utils/measure-text'

@Component({
  name: 'InfoText',
  props: ['text'],
  computed: {
    textOffsetLeft: function () {
      const { x } = this.$refs.containerEl.getBoundingClientRect()
      const { width } = this.$store.state.interface
      const maxWidth = width - x
      return maxWidth > 220 ? 0 : (220 - maxWidth)
    },
    textWidth: function () {
      const width = measureText(this.text, {
        fontSize: '12px',
        fontWeight: 'normal',
      })
      return `${Math.min(width, 200)}px`
    }
  }
})
export default class InfoText extends Vue {
  showingPopup = false
}
</script>

<style scoped>
.info-popup {
  position: absolute;
  display: flex;
  font-size: 12px;
  font-weight: normal;
  border-radius: 8px;
  color: #F2F2F2;
  background: #05141A;
  border: 1px solid #5D7078;
  padding: 8px;
  z-index: 100;
}
</style>
