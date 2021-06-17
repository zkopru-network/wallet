<template>
  <div>
    <input
      class="address-input"
      type="text"
      placeholder="Enter a valid Zkopru address"
      v-model="address"
    />
    <div v-if="addressState === 0" class="address-underline" style="background: #95A7AE" />
    <div v-if="addressState === 1" class="address-underline" style="background: green" />
    <div v-if="addressState === 2" class="address-underline" style="background: red" />
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Zkopru from '@zkopru/client/browser'

@Component({
  name: 'AddressField',
  watch: {
    address: function () {
      this.updateAddressState()
    }
  }
})
export default class AddressField extends Vue {
  address = ''
  // 0 = empty, 1 = valid, 2 = invalid
  addressState = 0

  updateAddressState() {
    if (this.address === '') {
      this.addressState = 0
      return
    }
    try {
      new Zkopru.ZkAddress(this.address)
      this.addressState = 1
    } catch (err) {
      this.addressState = 2
    }
  }
}
</script>
<style scoped>
.address-underline {
  height: 1px;
  width: 100%;
}
.address-input {
  border: 0px;
  background: transparent;
  color: white;
  width: 100%;
  font-family: Inter;
  font-size: 12px;
}
.address-input:placeholder {
  font-size: 9px;
}
.address-input:focus {
  border: 0px;
  outline: 0px;
}
</style>
