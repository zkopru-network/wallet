<template>
  <div>
    <textarea
      class="address-input"
      type="text"
      placeholder="Enter a valid Zkopru address or linked ENS / Ethereum address"
      v-model="address"
      spellcheck=false
      rows="2"
    />
    <div spacer style="height: 4px" />
    <div v-if="addressState === 0" class="address-underline" style="background: #95A7AE" />
    <div v-if="addressState === 1" class="address-underline" style="background: #00FFD1" />
    <div v-if="addressState === 2" class="address-underline" style="background: #F49F2F" />
    <div spacer v-if="addressState === 2" style="height: 26px" />
    <div v-if="addressState === 2" style="display: flex; align-items: center">
      <img :src="require('../../assets/warning.svg')" />
      <div spacer style="width: 13px" />
      <div style="color: #F49F2F; font-size: 12px">
        Must be a Zkopru address or linked ENS / Ethereum address
      </div>
    </div>
    <div spacer style="height: 2px" />
    <div style="font-size: 12px; color: white; max-width: 100%; word-wrap: break-word" v-if="addressAliased">
      {{ zkAddress }}
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Zkopru from '@zkopru/client/browser'

const ethAddressRegex = /^(0x)?[A-Fa-f0-9]{40}$/
const ensAddressRegex = /^[a-zA-Z0-9\-\._]+\.eth$/

@Component({
  name: 'AddressField',
  watch: {
    address: function () {
      this.updateAddressState()
    }
  },
  model: {
    prop: 'address',
    event: 'addressChanged',
  }
})
export default class AddressField extends Vue {
  address = ''
  // 0 = empty, 1 = valid, 2 = invalid
  addressState = 0
  addressAliased = false
  zkAddress = ''

  async updateAddressState() {
    if (this.address === '') {
      this.addressState = 0
      this.$emit('addressChanged', '')
      this.addressAliased = false
      this.zkAddress = ''
      return
    }
    if (ethAddressRegex.test(this.address)) {
      // try to resolve
      const address = `${this.address}`
      const resolved = await this.$store.dispatch('resolveAddress', address)
      if (this.address !== address) return
      if (resolved) {
        this.$emit('addressChanged', resolved)
        this.addressAliased = true
        this.zkAddress = resolved
        this.addressState = 1
      } else {
        this.addressState = 2
        this.$emit('addressChanged', '')
        this.addressAliased = false
        this.zkAddress = ''
      }
      return
    }
    if (ensAddressRegex.test(this.address)) {
      const address = `${this.address}`
      const resolved = await this.$store.dispatch('resolveENS', address)
      if (this.address !== address) return
      if (resolved) {
        this.$emit('addressChanged', resolved)
        this.addressAliased = true
        this.zkAddress = resolved
        this.addressState = 1
      } else {
        this.addressState = 2
        this.$emit('addressChanged', '')
        this.addressAliased = false
        this.zkAddress = ''
      }
      return
    }
    try {
      new Zkopru.ZkAddress(this.address)
      this.$emit('addressChanged', this.address)
      this.addressState = 1
      this.addressAliased = false
      this.zkAddress = this.address
    } catch (err) {
      this.$emit('addressChanged', '')
      this.addressState = 2
      this.addressAliased = false
      this.zkAddress = ''
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
  font-size: 14px;
  resize: none;
}
.address-input::placeholder {
  font-size: 14px;
  color: #95A7AE;
}
.address-input:focus {
  border: 0px;
  outline: 0px;
}
</style>
