<template>
  <div>
    <div style="position: relative; width: 100%">
      <input
        class="asset-input"
        type="text"
        :value="amount"
        v-on:input="$emit('amountChanged', $event.target.value)"
      />
      <div class="asset-buttons">
        <div
          v-for="buttonText in (buttons || []).reverse()"
          style="margin-right: 16px"
          class="asset-button"
          v-on:click="typeof buttonClicked === 'function' && buttonClicked(buttonText)"
        >
          {{ buttonText }}
        </div>
        <div style="font-size: 14px">{{asset}}</div>
      </div>
      <div spacer style="height: 5px" />
      <div v-if="amountState === 0" class="fee-underline" style="background: #5D7078" />
      <div v-if="amountState === 1" class="fee-underline" style="background: #00FFD1" />
      <div v-if="amountState === 2" class="fee-underline" style="background: #F49F2F" />
      <div v-if="amountState === 3" class="fee-underline animated" />
    </div>
    <div spacer style="height: 5px" />
    <div style="display: flex; width: 100%; font-size: 12px; color: #95A7AE">
      <div>0.00</div>
      <div spacer style="flex: 1" />
      <div>USD</div>
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
    'buttons',
    'buttonClicked',
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
.asset-buttons {
  position: absolute;
  right: 4px;
  top: 0px;
  color: white;
  user-select: none;
  display: flex;
}
.asset-button {
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
  margin: 0px 2px;
}
@keyframes underline-color {
  0% {
    background-color: #00FFD1;
  }
  50% {
    background-color: #F49F2F;
  }
  100% {
    background-color: #00FFD1;
  }
}
.fee-underline.animated {
  animation: underline-color 1s infinite linear;
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
