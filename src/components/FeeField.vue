<template>
  <div style="position: relative">
    <input
      class="fee-input"
      type="text"
      placeholder="3"
      v-model="fee"
    />
    <div class="gwei-text">GWEI</div>
    <div v-if="feeState === 0" class="fee-underline" style="background: #95A7AE" />
    <div v-if="feeState === 1" class="fee-underline" style="background: green" />
    <div v-if="feeState === 2" class="fee-underline" style="background: red" />
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Zkopru from '@zkopru/client/browser'

@Component({
  name: 'FeeField',
  watch: {
    fee: function () {
      this.updateFeeState()
    }
  }
})
export default class AddressField extends Vue {
  fee= '5'
  // 0 = empty, 1 = valid, 2 = invalid
  feeState = 0

  mounted() {
    this.updateFeeState()
  }

  updateFeeState() {
    if (this.fee === '') {
      this.feeState = 0
      return
    }
    if (isNaN(+this.fee)) {
      this.feeState = 2
    } else {
      this.feeState = 1
    }
  }
}
</script>
<style scoped>
.gwei-text {
  position: absolute;
  right: 10px;
  top: 0px;
  color: white;
  user-select: none;
}
.fee-underline {
  height: 1px;
  width: 100%;
}
.fee-input {
  border: 0px;
  background: transparent;
  color: white;
  width: 100%;
  font-family: Inter;
  font-size: 12px;
}
.fee-input:placeholder {
  font-size: 9px;
}
.fee-input:focus {
  border: 0px;
  outline: 0px;
}
</style>
