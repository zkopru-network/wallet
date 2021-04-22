<template>
  <div class="container">
    <Header />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Header from './components/Header'

@Component({
  name: 'Wallet',
  components: { Header, },
})
export default class Wallet extends Vue {
  mounted() {
    this.$store.dispatch('startSync')
  }
}
</script>

<style scoped>
.container {
  display: flex;
}
</style>
