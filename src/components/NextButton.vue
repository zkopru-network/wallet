<template>
  <div style="display: flex; flex-direction: column; width: 100%">
    <div
      :class="`next-button ${disabled && 'disabled'}`"
      v-on:click="nextClicked"
    >
      {{ text || 'Next' }}
    </div>
    <div
      v-if="typeof onBack === 'function'"
      class="back-button"
      v-on:click="backClicked"
    >
      <img :src="require('../../assets/arrow_left.svg')" />
      <div spacer style="width: 15px" />
      <div>Back</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'NextButton',
  props: ['disabled', 'onNext', 'onBack', 'text']
})
export default class NextButton extends Vue {
  nextClicked() {
    if (this.disabled) return
    if (typeof this.onNext !== 'function') return
    this.onNext()
  }
  backClicked() {
    if (typeof this.onBack !== 'function') return
    this.onBack()
  }
}
</script>
<style scoped>
.next-button {
  background-color: #A2EfE1;
  border-radius: 20px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 27px;
  cursor: pointer;
  user-select: none;
}
.disabled {
  background-color: #3F6767;
  border: 1px solid black;
}
.back-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  align-self: center;
  color: #85C7BD;
  margin-top: 28px;
  user-select: none;
}
</style>
