<template>
  <div>
    <Button>
      Send
    </Button>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Button from './Button'

@Component({
  name: 'WalletTransfer',
  components: { Button, },
})
export default class WalletTransfer extends Vue {}
</script>

<style scoped>
</style>
