<template>
  <div class="outer-container">
    <div class="button-container">
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
})
export default class Button extends Vue {}
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
}
.button-text {
  font-weight: 500;
  font-size: 24px;
}
</style>
