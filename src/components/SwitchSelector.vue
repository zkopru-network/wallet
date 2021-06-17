<template>
  <div style="display: flex">
    <div v-for="(option, index) in options">
      <div
        :class="`select-element ${index === selectedOption ? 'active' : ''}`"
        :style="`${index > 0 ? 'margin-left: 4px' : ''} ${index < options.length - 1 ? 'margin-right: 4px' : ''}`"
        v-on:click="selectOption(index)"
      >
        <span v-if="typeof option === 'string' || option && option.text" style="margin-right: 10px">
          {{ typeof option === 'string' ? option : option.text }}
        </span>
        <ColorImage
          v-if="typeof option === 'object' && option.image || (option.activeImage && option.inactiveImage)"
          :src="option.image || (index === selectedOption ? option.activeImage : option.inactiveImage)"
          :width="option.imageWidth || 'auto'"
          :height="option.imageHeight || 'auto'"
          :color="option.color || index === selectedOption ? option.activeColor : option.inactiveColor"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ColorImage from './ColorImage'

@Component({
  name: 'SwitchSelector',
  components: { ColorImage, },
  props: {
    options: {
      type: Array,
    },
    onChange: {
      type: Function,
    },
    selectedOption: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  model: {
    prop: 'selectedOption',
    event: 'selectionChanged',
  }
})
export default class SwitchSelector extends Vue {
  selectOption(index) {
    this.$emit('selectionChanged', index)
    if (typeof this.onChange === 'function') {
      this.onChange(index)
    }
  }
}
</script>
<style scoped>
.select-element.active {
  background-color: #00ffd1;
  color: #000;
}
.select-element {
  background-color: #0e2936;
  border-radius: 4px;
  padding: 12px 32px;
  font-weight: bold;
  color: #edf2f2;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
</style>
