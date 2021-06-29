<template>
  <div style="position: relative">
    <input
      class="fee-input"
      type="text"
      placeholder="3"
      :value="fee"
      v-on:input="$emit('feeChanged', $event.target.value)"
    />
    <div class="buttons">
      <div
        v-for="buttonText in (buttons || []).reverse()"
        style="margin-right: 16px"
        class="button"
        v-on:click="typeof buttonClicked === 'function' && buttonClicked(buttonText)"
      >
        {{ buttonText }}
      </div>
      <div class="gwei-text">GWEI</div>
    </div>
    <div spacer style="height: 4px" />
    <div v-if="feeState === 0" class="fee-underline" style="background: #5D7078" />
    <div v-if="feeState === 1" class="fee-underline" style="background: #00FFD1" />
    <div v-if="feeState === 2" class="fee-underline" style="background: #F49F2F" />
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Zkopru from '@zkopru/client/browser'

@Component({
  name: 'FeeField',
  props: [
    'fee',
    'buttons',
    'buttonClicked',
  ],
  watch: {
    fee: function () {
      this.updateFeeState()
    }
  },
  model: {
    prop: 'fee',
    event: 'feeChanged',
  }
})
export default class AddressField extends Vue {
  // 0 = empty, 1 = valid, 2 = invalid
  feeState = 0

  mounted() {
    this.updateFeeState()
  }

  updateFeeState() {
    if (this.fee === '' || this.fee === '0') {
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
  color: white;
  font-size: 14px;
}
.buttons {
  position: absolute;
  right: 4px;
  top: 0px;
  color: white;
  user-select: none;
  display: flex;
}
.button {
  color: white;
  border: 1px solid #5D7078;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 0px 10px;
  font-size: 12px;
  cursor: pointer;
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
  font-size: 14px;
}
.fee-input::placeholder {
  font-size: 14px;
  color: #95A7AE;
}
.fee-input:focus {
  border: 0px;
  outline: 0px;
}
</style>
