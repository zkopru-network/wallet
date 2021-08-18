<template>
  <div style="position: relative">
    <div
      :class="`address-input-container ${addressState === 3 ? 'fee-border animated' : ''}`"
      :style="`display: flex; flex-direction: column;
        ${addressState === 0 ? 'border-color: #5D7078;' : ''}
        ${addressState === 1 ? 'border-color: #00FFD1;' : ''}
        ${addressState === 2 ? 'border-color: #F49F2F;' : ''}
      `"
    >
      <textarea
        ref="addressInput"
        class="address-input"
        type="text"
        placeholder="Enter valid address"
        v-model="address"
        spellcheck=false
        :rows="textAreaHeight < 40 ? 1 : 2"
        :style="`
          ${addressAliased ? 'text-indent: 20px;' : ''}
        `"
      />
      <textarea
        ref="addressInputGhost"
        class="address-input"
        type="text"
        placeholder="Enter valid address"
        spellcheck=false
        :rows="1"
        :style="`
          ${addressAliased ? 'text-indent: 20px;' : ''}
          position: absolute;
          left: -99999999999px;
          top: -9999999999999px;
        `"
      />
      <div v-if="showingAliasDetails" class="alias-details">
        <div v-if="ethAddress !== address" style="display: flex; margin-bottom: 12px">
          <img
            :src="require('../../assets/address_info_arrow.svg')"
            style="margin: 0px 4px;"
          />
          <div style="color: #95A7AE; margin: 0px 6px;">
            ETH
          </div>
          <div style="margin: 0px 8px;">
            {{ ethAddress }}
          </div>
        </div>
        <div style="display: flex; align-items: center; max-width: 100%">
          <img
            :src="require('../../assets/address_info_arrow.svg')"
            style="margin: 0px 8px;"
          />
          <div style="color: #95A7AE; margin: 0px 6px;">
            Zkopru
          </div>
          <div style="margin: 0px 4px; word-wrap: break-word; overflow: auto">
            {{ zkAddress }}
          </div>
        </div>
      </div>
    </div>
    <div spacer v-if="addressState === 2 || addressState === 3" style="height: 18px" />
    <div v-if="addressState === 2" style="display: flex; align-items: center">
      <img :src="require('../../assets/warning.svg')" />
      <div spacer style="width: 13px" />
      <div style="color: #F49F2F; font-size: 12px">
        Must be a Zkopru address or linked ENS / Ethereum address
      </div>
    </div>
    <div v-if="addressState === 3" style="font-size: 12px; color: white; max-width: 100%; word-wrap: break-word">
      Confirming registration...
    </div>
    <img
      v-if="addressAliased"
      v-on:click="showingAliasDetails = !showingAliasDetails"
      :src="showingAliasDetails ?
        require('../../assets/chevron_up_double_light.svg') :
        require('../../assets/chevron_down_double_light.svg')
      "
      width="24px"
      style="position: absolute; top: 8px; left: 4px; cursor: pointer"
    />
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
      this.address = this.address.trim()
      this.showingAliasDetails = false
      this.$refs.addressInputGhost.value = this.address
      this.textAreaHeight = this.$refs.addressInputGhost.scrollHeight
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
  showingAliasDetails = false
  textAreaHeight = 0

  async updateAddressState() {
    if (this.address === '') {
      this.addressState = 0
      this.$emit('addressChanged', '')
      this.addressAliased = false
      this.zkAddress = ''
      this.ethAddress = ''
      return
    }
    if (ethAddressRegex.test(this.address)) {
      // try to resolve
      const address = `${this.address}`
      this.addressState = 3
      const resolved = await this.$store.dispatch('resolveAddress', address)
      if (this.address !== address) return
      if (resolved) {
        this.$emit('addressChanged', resolved)
        this.addressAliased = true
        this.zkAddress = resolved
        this.ethAddress = address
        this.addressState = 1
      } else {
        this.addressState = 2
        this.$emit('addressChanged', '')
        this.addressAliased = false
        this.zkAddress = ''
        this.ethAddress = ''
      }
      return
    }
    if (ensAddressRegex.test(this.address)) {
      const address = `${this.address}`
      this.addressState = 3
      const { ethAddress, zkAddress }= await this.$store.dispatch('resolveENS', address)
      if (this.address !== address) return
      if (zkAddress) {
        this.$emit('addressChanged', zkAddress)
        this.addressAliased = true
        this.zkAddress = zkAddress
        this.ethAddress = ethAddress
        this.addressState = 1
      } else {
        this.addressState = 2
        this.$emit('addressChanged', '')
        this.addressAliased = false
        this.zkAddress = ''
        this.ethAddress = ''
      }
      return
    }
    try {
      const address = `${this.address}`
      new Zkopru.ZkAddress(address)
      this.$emit('addressChanged', address)
      this.addressState = 1
      this.addressAliased = false
      this.zkAddress = address
      this.ethAddress = ''
    } catch (err) {
      this.$emit('addressChanged', '')
      this.addressState = 2
      this.addressAliased = false
      this.zkAddress = ''
      this.ethAddress = ''
    }
  }
}
</script>
<style scoped>
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
.address-input-container {
  border: 1px solid #2A3D46;
  border-radius: 8px;
  background: #05141A;
}
.address-input {
  border-radius: 8px;
  border: 0px;
  background: #05141A;
  color: white;
  font-family: Inter;
  font-size: 14px;
  padding: 10px;
  width: calc(100% - 20px);
  resize: none;
}
.address-input::placeholder {
  font-size: 14px;
  color: #95A7AE;
}
.address-input:focus {
  outline: 0px;
}
.alias-details {
  color: white;
  padding: 10px;
  font-size: 11px;
  max-width: 100%;
}
</style>
