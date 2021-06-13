<template>
  <div class="outer-container">
    <div :style="buttonStyle" class="button-container" v-on:click="_onClick()">
      <slot v-if="!loading"></slot>
      <div v-if="loading" class="button-text">
        {{ loadingText || 'Loading...' }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'Button',
  props: [ 'onClick', 'loadingText', 'buttonStyle' ],
})
export default class Button extends Vue {
  loading = false
  async _onClick() {
    if (this.onClick) {
      // execute
      if (this.loading) return
      try {
        this.loading = true
        await this.onClick()
        this.loading = false
      } catch (err) {
        this.loading = false
        throw err
      }
    }
  }
}
</script>

<style scoped>
.outer-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.button-container {
  background-color: #0E2936;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  color: #EDF2F2;
  padding: 12px 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-weight: bold;
  font-size: 24px;
  user-select: none;
}
</style>
