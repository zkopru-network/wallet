<template>
  <div class="container">
    <LeftMenu />
    <div style="display: flex; flex-direction: column; flex: 1; height: 100%">
      <HeaderSection />
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import LeftMenu from './LeftMenu'
import HeaderSection from './HeaderSection'

@Component({
  name: 'HeaderLeftMenu',
  components: { LeftMenu, HeaderSection, },
})
export default class HeaderLeftMenu extends Vue {}
</script>
<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #05141A;
}
</style>
