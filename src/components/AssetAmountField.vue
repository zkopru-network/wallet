<template>
  <div>
    <div style="position: relative; width: 100%">
      <input
        class="asset-input"
        type="text"
        :value="amount"
        v-on:input="$emit('amountChanged', $event.target.value)"
      />
      <div class="asset-text">{{asset}}</div>
      <div spacer style="height: 4px" />
      <div v-if="amountState === 0" class="fee-underline" style="background: #95A7AE" />
      <div v-if="amountState === 1" class="fee-underline" style="background: #00FFD1" />
      <div v-if="amountState === 2" class="fee-underline" style="background: #F49F2F" />
    </div>
    <div spacer style="height: 5px" />
    <div style="display: flex; width: 100%; font-size: 12px; color: white">
      <div spacer style="width: 2px" />
      <div>0.00</div>
      <div spacer style="flex: 1" />
      <div>USD</div>
      <div spacer style="width: 4px" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Zkopru from '@zkopru/client/browser'

@Component({
  name: 'AssetAmountField',
  props: [
    'asset',
    'loadBalance',
    'assetAmountState',
    'amount',
  ],
  computed: {
    // 0 = empty, 1 = valid, 2 = invalid
    amountState() {
      if (typeof this.assetAmountState !== 'undefined') {
        return this.assetAmountState
      }
      if (this.amount === '' || this.amount === '0') {
        return 0
      }
      if (isNaN(+this.amount)) {
        return 2
      } else {
        return 1
      }
    }
  },
  model: {
    prop: 'amount',
    event: 'amountChanged',
  }
})
export default class AssetAmountField extends Vue {
}
</script>
<style scoped>
.asset-text {
  position: absolute;
  right: 4px;
  top: 0px;
  color: white;
  user-select: none;
}
.fee-underline {
  height: 1px;
  width: 100%;
}
.asset-input {
  border: 0px;
  background: transparent;
  color: white;
  width: 100%;
  font-family: Inter;
  font-size: 14px;
}
.asset-input::placeholder {
  font-size: 14px;
  color: #95A7AE;
}
.asset-input:focus {
  border: 0px;
  outline: 0px;
}
</style>
