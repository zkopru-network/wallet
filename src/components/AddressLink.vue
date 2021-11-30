<template>
  <div v-on:click="openLink" class="link">
    {{ address ? address : txHash }}
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'AddressLink',
  props: ['address', 'txHash'],
})
export default class AddressLink extends Vue {
  openLink() {
    if (this.address) {
      window.open(`https://goerli.etherscan.io/address/${this.address}`, '_blank')
    } else if (this.txHash) {
      window.open(`https://goerli.etherscan.io/tx/${this.txHash}`, '_blank')
    }
  }
}
</script>

<style scoped>
.link {
  cursor: pointer;
  display: inline;
}
</style>
