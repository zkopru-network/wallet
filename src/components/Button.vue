<template>
  <div class="outer-container">
    <div class="button-container" v-on:click="_onClick()">
      <div class="button-text">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'Button',
  props: [ 'onClick', ],
})
export default class Button extends Vue {
  _onClick() {
    if (this.onClick) {
      // execute
      this.onClick()
    }
  }
}
</script>

<style scoped>
.outer-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.button-container {
  background-color: #00FFD1;
  border-radius: 4px;
  padding-top: 9.5px;
  padding-bottom: 9.5px;
  padding-left: 64px;
  padding-right: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.button-text {
  font-weight: 500;
  font-size: 24px;
  user-select: none;
}
</style>
