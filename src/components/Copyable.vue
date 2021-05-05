<template>
  <div class="copy-container" v-on:click="copy">
    <slot></slot>
    <div class="ghost" ref="ghostEl">
      {{ fullText }}
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'Copyable',
  props: ['fullText'],
})
export default class Copyable extends Vue {
  copy() {
    if (document.selection) {
      const range = document.body.createTextRange()
      range.moveToElementText(this.$refs.ghostEl)
      range.select()
    } else if (window.getSelection) {
      window.getSelection().empty()
      const range = document.createRange()
      range.selectNode(this.$refs.ghostEl)
      window.getSelection().addRange(range)
    }
    document.execCommand('copy')
  }
}
</script>

<style scoped>
.copy-container {
  position: relative;
  cursor: pointer;
}
.ghost {
  position: fixed;
  top: -999999px;
  left: -999999px;
}
</style>
