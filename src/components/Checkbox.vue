<template>
  <div class="checkbox-container">
    <div class="checkbox-inner" v-on:click="checkboxClicked">
      <div class="checkbox-unchecked" v-show="!checked" />
      <div class="checkbox-checked" v-show="checked" />
      <div spacer style="width: 8px" />
      <div class="checkbox-text" v-if="text">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'Checkbox',
  props: [ 'onChange', 'text', ]
})
export default class Checkbox extends Vue {
  checked = false
  checkboxClicked(e) {
    e.stopPropagation()
    this.checked = !this.checked
    if (typeof this.onChange === 'function') {
      this.onChange()
    }
  }
}
</script>

<style scoped>
.checkbox-container {
  display: flex;
  justify-content: center;
}
.checkbox-inner {
  display: flex;
  cursor: pointer;
}
.checkbox-text {
  font-size: 18px;
  color: white;
  user-select: none;
}
.checkbox-unchecked {
  background-image: url('../../assets/unchecked.svg');
  background-size: contain;
  width: 22px;
  height: 21px;
  cursor: pointer;
}
.checkbox-checked {
  background-image: url('../../assets/checked.svg');
  width: 22px;
  height: 22px;
  cursor: pointer;
}
</style>
