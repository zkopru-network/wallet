<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'App',
})
export default class App extends Vue {}
</script>

<style>
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: normal;
  src: url('../assets/fonts/Inter-Regular.ttf');
}
@font-face {
  font-family: 'Inter';
  font-style: bold;
  font-weight: bold;
  src: url('../assets/fonts/Inter-Bold.ttf');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  src: url('../assets/fonts/Inter-Medium.ttf');
}
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300;
  src: url('../assets/fonts/Inter-Light.ttf');
}
body {
  margin: 0px;
  background: #081B24;
  font-family: 'Inter';
}
</style>
