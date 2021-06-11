<template>
  <div>
    <transition
      name="blur-fade"
      mode="out-in"
    >
      <div
        :style="`
          filter: blur(${blurred ? this.blurRadius : '0px'});
          -webkit-filter: blur(${blurred ? this.blurRadius : '0px'});
        	-moz-filter: blur(${blurred ? this.blurRadius : '0px'});
        	-o-filter: blur(${blurred ? this.blurRadius : '0px'});
        	-ms-filter: blur(${blurred ? this.blurRadius : '0px'});
        `"
        v-bind:key="blurred"
      >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'BlurOverlay',
  props: ['blurred'],
})
export default class BlurOverlay extends Vue {
  blurRadius = '10px'
}
</script>
<style scoped>
.no-blur-fade-enter-active {
  animation: blur-fade-in 0.8s reverse;
}
.no-blur-fade-leave-active {
  animation: blur-fade-in 0.8s;
}
.blur-fade-enter-active {
  /* animation: blur-fade-in 0.8s; */
}
.blur-fade-leave-active {
  animation: blur-fade-in 0.8s reverse;
}
@keyframes blur-fade-in {
  0% {
    filter: blur(0px);
    -webkit-filter: blur(0px);
  	-moz-filter: blur(0px);
  	-o-filter: blur(0px);
  	-ms-filter: blur(0px);
  }
  50% {
    filter: blur(5px);
    -webkit-filter: blur(5px);
  	-moz-filter: blur(5px);
  	-o-filter: blur(5px);
  	-ms-filter: blur(5px);
  }
  100% {
    filter: blur(10px);
    -webkit-filter: blur(10px);
  	-moz-filter: blur(10px);
  	-o-filter: blur(10px);
  	-ms-filter: blur(10px);
  }
}
</style>
