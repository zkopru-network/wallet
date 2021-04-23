<template>
  <div class="zkopru-background-container">
    <div class="zkopru-background-gradient" />
    <div class="zkopru-background-image" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'ZkopruBackground',
})
export default class ZkopruBackground extends Vue {}
</script>

<style scoped>
.zkopru-background-container {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: -1;
}
.zkopru-background-gradient {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: radial-gradient(
    127.44% 155.53% at 93.41% 11.94%,
    rgba(14, 41, 54, 0.65) 73.7%,
    rgba(0, 255, 209, 0.15) 100%
  );
}
.zkopru-background-image {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-image: url('../../assets/zkopru.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  opacity: 0.5;
}
</style>
