<template>
  <div>
    <div style="position: relative; width: 100%">
      <input
        class="asset-input"
        type="text"
        placeholder="Max: 0"
        v-model="amount"
      />
      <div class="asset-text">{{asset}}</div>
      <div v-if="amountState === 0" class="fee-underline" style="background: #95A7AE" />
      <div v-if="amountState === 1" class="fee-underline" style="background: green" />
      <div v-if="amountState === 2" class="fee-underline" style="background: red" />
    </div>
    <div spacer style="height: 2px" />
    <div style="display: flex; width: 100%; font-size: 9px;">
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
  props: ['asset'],
  watch: {
    amount() {
      this.updateAmountState()
    }
  }
})
export default class AssetAmountField extends Vue {
  amount = ''
  // 0 = empty, 1 = valid, 2 = invalid
  amountState = 0

  mounted() {
    this.updateAmountState()
  }

  updateAmountState() {
    if (this.amount === '' || this.amount === '0') {
      this.amountState = 0
      return
    }
    if (isNaN(+this.amount)) {
      this.amountState = 2
    } else {
      this.amountState = 1
    }
  }
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
  font-size: 12px;
}
.asset-input:placeholder {
  font-size: 9px;
}
.asset-input:focus {
  border: 0px;
  outline: 0px;
}
</style>
