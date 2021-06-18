<template>
  <div>
    <input
      class="address-input"
      type="text"
      placeholder="Enter a valid Zkopru address"
      v-model="address"
      spellcheck=false
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
    prop: 'addressInfo',
    event: 'addressChanged',
  }
})
export default class AddressField extends Vue {
  address = ''
  // 0 = empty, 1 = valid, 2 = invalid
  addressState = 0

  async updateAddressState() {
    if (this.address === '') {
      this.addressState = 0
      this.$emit('addressChanged', {
        zkAddress: '',
        aliased: false,
      })
      return
    }
    if (ethAddressRegex.test(this.address)) {
      // try to resolve
      const address = `${this.address}`
      const resolved = await this.$store.dispatch('resolveAddress', address)
      if (this.address !== address) return
      if (resolved) {
        this.$emit('addressChanged', {
          zkAddress: resolved,
          aliased: true,
        })
        this.addressState = 1
      } else {
        this.addressState = 2
        this.$emit('addressChanged', {
          zkAddress: '',
          aliased: false,
        })
      }
      return
    }
    if (ensAddressRegex.test(this.address)) {
      const address = `${this.address}`
      const resolved = await this.$store.dispatch('resolveENS', address)
      if (this.address !== address) return
      if (resolved) {
        this.$emit('addressChanged', {
          zkAddress: resolved,
          aliased: true,
        })
        this.addressState = 1
      } else {
        this.addressState = 2
        this.$emit('addressChanged', {
          zkAddress: '',
          aliased: false,
        })
      }
      return
    }
    try {
      new Zkopru.ZkAddress(this.address)
      this.$emit('addressChanged', {
        zkAddress: this.address,
        aliased: false,
      })
      this.addressState = 1
    } catch (err) {
      this.$emit('addressChanged', {
        zkAddress: '',
        aliased: false,
      })
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
