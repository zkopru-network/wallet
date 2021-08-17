<template>
  <div class="container">
    <LeftMenu />
    <div style="display: flex; flex: 1; justify-content: center">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import LeftMenu from './LeftMenu'

@Component({
  name: 'CenteredLeftMenu',
  components: { LeftMenu, },
})
export default class CenteredLeftMenu extends Vue {}
</script>
<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #05141A;
}
</style>
