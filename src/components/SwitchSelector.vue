<template>
  <div style="display: flex">
    <div v-for="(option, index) in options">
      <div v-if="index > 0" spacer style="width: 4px" />
      <div
        :class="`select-element ${index === selectedOption ? 'active' : ''}`"
        v-on:click="selectOption(index)"
      >
        <span
          v-if="typeof option === 'string' || option && option.text"
          :style="option && option.image ? 'margin-right: 10px' : ''"
        >
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
      <div v-if="index < options.length - 1" spacer style="width: 4px" />
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
  color: white;
  border-bottom: 1px solid #9EFFEE;
}
.select-element {
  padding: 8px 14px;
  color: #95A7AE;
  cursor: pointer;
  display: flex;
  align-items: center;
  user-select: none;
}
</style>
