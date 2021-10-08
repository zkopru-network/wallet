<template>
  <div style="position: relative">
    <input
      :class="`asset-input ${amountState === 3 ? 'fee-border animated' : ''}`"
      type="text"
      :value="amount"
      v-on:input="$emit('amountChanged', $event.target.value)"
      :style="`
        ${amountState === 0 ? 'border-color: #5D7078' : ''}
        ${amountState === 1 ? 'border-color: #00FFD1' : ''}
        ${amountState === 2 ? 'border-color: #F49F2F' : ''}
      `"
    />
    <div class="asset-buttons">
      <div
        v-for="buttonText in (buttons || []).reverse()"
        style="margin-right: 4px"
        class="asset-button"
        v-on:click="typeof buttonClicked === 'function' && buttonClicked(buttonText)"
      >
        {{ buttonText }}
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

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
  top: 12px;
  color: white;
  user-select: none;
  display: flex;
}
.asset-button {
  color: #95A7AE;
  padding: 0px 12px;
  font-size: 12px;
  cursor: pointer;
}
.fee-border {
}
@keyframes border-color-anim {
  0% {
    border-color: #00FFD1;
  }
  50% {
    border-color: #F49F2F;
  }
  100% {
    border-color: #00FFD1;
  }
}
.fee-border.animated {
  animation: border-color-anim 1s infinite linear;
}
.asset-input {
  border: 0px;
  background: #05141A;
  color: white;
  font-family: Inter;
  font-size: 14px;
  padding: 10px;
  width: calc(100% - 20px);
  border: 1px solid #2A3D46;
  border-radius: 8px;
}
.asset-input::placeholder {
  font-size: 14px;
  color: #95A7AE;
}
.asset-input:focus {
  outline: 0px;
}
</style>
