<template>
  <div v-on:click="openLink" class="link">
    {{ address }}
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'AddressLink',
  props: ['address'],
})
export default class AddressLink extends Vue {
  openLink() {
    window.open(`https://goerli.etherscan.io/address/${this.address}`, '_blank')
  }
}
</script>

<style scoped>
.link {
  cursor: pointer;
  display: inline;
}
</style>
