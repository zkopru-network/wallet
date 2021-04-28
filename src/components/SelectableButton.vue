<template>
  <div class="selectable-container" v-on:click="_onClick">
    <img v-show="selected" :src="imgSelected" />
    <img v-show="!selected" :src="imgUnselected" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'SelectableButton',
  props: ['imgSelected', 'imgUnselected', 'selected', 'onChange'],
  model: {
    prop: 'selected',
    event: 'selectedChanged',
  },
})
export default class SelectableButton extends Vue {
  _onClick(e) {
    e.stopPropagation()
    this.$emit('selectedChanged', !this.selected)
    if (typeof this.onChange === 'function') {
      this.onChange()
    }
  }
}
</script>

<style scoped>
.selectable-container {
  cursor: pointer;
}
</style>
