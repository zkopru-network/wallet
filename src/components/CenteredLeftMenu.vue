<template>
  <HeaderLeftMenu>
    <div style="display: flex; flex: 1; justify-content: center; position: relative">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <slot></slot>
      </div>
    </div>
  </HeaderLeftMenu>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import HeaderLeftMenu from './HeaderLeftMenu'

@Component({
  name: 'CenteredLeftMenu',
  components: { HeaderLeftMenu, },
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
