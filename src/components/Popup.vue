<template>
  <div class="popup-background" v-on:click="cancel" v-if="this.visible">
    <div class="popup-container" v-on:click="captureClick">
      <slot>
      </slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'Popup',
  props: ['visible', 'onCancel',]
})
export default class Popup extends Vue {
  cancel() {
    if (typeof this.onCancel === 'function') {
      this.onCancel()
    } else {

    }
  }

  captureClick(e) {
    e.stopPropagation()
  }
}
</script>

<style scoped>
.popup-background {
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  background-color: rgba(0, 27, 36, 0.9);
  display: flex;
  flex-direction: column;
  padding-top: 117px;
  /* justify-content: center; */
  align-items: center;
}
.popup-container {
  background-color: #0E2936;
  border: 1px solid #5D7078;
  border-radius: 8px;
  max-width: 575px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}
.popup-title {
  color: white;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.1em;
  text-align: center;
}
.popup-body {
  font-size: 18px;
  color: white;
  text-align: center;
}
.popup-footer {
  color: #95A7AE;
  font-size: 16px;
  text-align: center;
}
</style>
