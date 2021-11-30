<template>
  <div
    :class="blurClass"
    :style="`
      ${blurred ? `
      filter: blur(${this.blurRadius});
      -webkit-filter: blur(${this.blurRadius});
    	-moz-filter: blur(${this.blurRadius});
    	-o-filter: blur(${this.blurRadius});
    	-ms-filter: blur(${this.blurRadius});
      ` : ''}
    `"
  >
    <!-- consume clicks -->
    <div
      v-if="blurred"
      v-on:click=""
      style="position: fixed; left: 0px; right: 0px; top: 0px; bottom: 0px"
    />
    <slot></slot>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'BlurOverlay',
  props: ['blurred'],
  watch: {
    blurred: function (newVal, oldVal) {
      if (this.blurClassTimer) {
        clearTimeout(this.blurClassTimer)
        this.blurClassTimer = null
      }
      if (!oldVal && newVal) {
        // apply the blur
        this.blurClass = 'blur-fade-enter'
        this.blurClassTimer = setTimeout(() => {
          this.blurClass = ''
        }, 1000)
      } else if (oldVal && !newVal) {
        // remove the blur
        this.blurClass = 'blur-fade-leave'
        this.blurClassTimer = setTimeout(() => {
          this.blurClass = ''
        }, 1000)
      }
    }
  }
})
export default class BlurOverlay extends Vue {
  blurRadius = '10px'
  blurClassTimer = null
  blurClass = ''
}
</script>
<style scoped>
.blur-container {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
.blur {
  filter: blur(10px);
  -webkit-filter: blur(10px);
	-moz-filter: blur(10px);
	-o-filter: blur(10px);
	-ms-filter: blur(10px);
}
.blur-fade-enter {
  animation: blur-fade-in 0.4s;
}
.blur-fade-leave {
  animation: blur-fade-in 0.4s reverse;
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
