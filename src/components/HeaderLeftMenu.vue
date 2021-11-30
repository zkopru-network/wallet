<template>
  <div class="container">
    <LeftMenu />
    <!-- left is 200px to account for LeftMenu width -->
    <HeaderSection
      style="background: #05141A; position: fixed; top: 0px; right: 0px; left: 200px; z-index: 10000000"
    />
    <!-- subtract 46px from height to account for HeaderSection height -->
    <!-- TODO: refactor to avoid these calculations -->
    <div style="display: flex; flex-direction: column; flex: 1; height: calc(100% - 46px); margin-top: 46px">
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
