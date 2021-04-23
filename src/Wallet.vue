<template>
  <div class="container">
    <Header />
    <div class="wallet-body">
      <div class="wallet-title">
        Account
      </div>
      <div spacer style="height: 8px" />
      <div class="wallet-subtitle">
        {{ address }}
      </div>
      <div class="horizontal-divider" />
    </div>
    <ZkopruBackground />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Header from './components/Header'
import ZkopruBackground from './components/ZkopruBackground'

@Component({
  name: 'Wallet',
  components: { Header, ZkopruBackground, },
})
export default class Wallet extends Vue {
  address = '75a...987'
  mounted() {
    this.$store.dispatch('startSync')
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.wallet-body {
  max-width: 1282px;
  margin-left: 80px;
  margin-right: 80px;
  padding-top: 36px;
  padding-bottom: 36px;
  background-color: rgba(8, 27, 36, 0.7);
  border: 1px solid #5D7078;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}
.wallet-title {
  color: white;
  font-weight: bold;
  font-size: 24px;
  align-self: center;
  letter-spacing: 0.1em;
}
.wallet-subtitle {
  color: white;
  font-size: 18px;
  align-self: center;
}
.horizontal-divider {
  height: 1px;
  background-color: #5D7078;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 38px;
  margin-bottom: 28px;
}
</style>
