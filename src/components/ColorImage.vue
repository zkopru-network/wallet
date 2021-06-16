<template>
  <div
    :src="src"
    :style="`
      mask-image: url(${src});
      mask-repeat: no-repeat;
      mask-size: contain;
      background-color: ${color || 'white'};
      width: ${calculatedWidth};
      height: ${calculatedHeight};
    `"
  >
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
@Component({
  name: 'ColorImage',
  props: ['src', 'color', 'width', 'height'],
  watch: {
    height: function () {
      this.updateCalculatedSize()
    },
    width: function () {
      this.updateCalculatedSize()
    },
    src: function (newVal, oldVal) {
      this.updateSize(newVal, oldVal)
    }
  }
})
export default class ColorImage extends Vue {
  // The value calculated from the image itself
  imageWidth = 0
  imageHeight = 0

  // Either the width/height prop or the actual image size
  // e.g. the same behavior as an img tag
  calculatedWidth = 0
  calculatedHeight = 0

  mounted() {
    this.updateCalculatedSize()
    this.updateSize(this.src, undefined)
  }

  updateCalculatedSize() {
    this.calculatedHeight = this.height && this.height !== 'auto' ? this.height : `${this.imageHeight}px`
    this.calculatedWidth = this.width && this.width !== 'auto' ? this.width : `${this.imageWidth}px`
  }

  updateSize(newVal, oldVal) {
    if (newVal === oldVal) return
    if (!newVal) return
    // otherwise load the dimensions
    const image = new Image()
    image.src = newVal
    image.onload = () => {
      if (newVal !== this.src) return
      this.imageWidth = image.width
      this.imageHeight = image.height
      this.updateCalculatedSize()
    }
  }
}
</script>
<style scoped>
</style>
