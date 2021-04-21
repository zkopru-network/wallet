<template>
  <div>
    <h2>Zkopru Browser Node</h2>
    <div v-if="!$store.state.zkopru.client">
      <span style="font-weight: bold">Loading...</span>
    </div>
    <div v-if="$store.state.zkopru.client && $store.state.zkopru.client.node">
      <div>
        Address:
        <a :href="`https://goerli.etherscan.io/address/${$store.state.zkopru.client.node.layer1.address}`">
          {{ $store.state.zkopru.client.node.layer1.address }}
        </a>
      </div>
      <div>
        <h4>Sync info:</h4>
        <div>
          Status: <span style="font-weight: bold">{{ $store.state.zkopru.status }}</span>
        </div>
        <div>
          Proposal Count: {{ $store.state.zkopru.proposalCount }}
        </div>
        <div>
          Current Block: {{ $store.state.zkopru.latestBlock }}
        </div>
      </div>
      <div>
        <h4>Wallet</h4>
        <div v-if="!$store.state.zkopru.wallet">
          <button v-on:click="createWallet">Create Wallet</button>
        </div>
        <div v-if="$store.state.zkopru.wallet">
          <div>{{ $store.state.zkopru.wallet.account.ethAddress }}</div>
          <div>{{ $store.state.zkopru.wallet.account.zkAddress.address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Zkopru from '@zkopru/client/browser'

@Component({
  name: 'Home',
  components: {},
  metaInfo: {
    title: 'Zkopru Browser',
  },
})
export default class Home extends Vue {
  async mounted() {
    await this.$store.dispatch('startSync')
  }

  createWallet() {
    const _privateKey = []
    for (let i = 0; i < 64; i++) {
      privateKey.push(Math.floor(Math.random() * 16))
    }
    const privateKey = `0x${_privateKey.map(n => n.toString(16)).join('')}`
    console.log(privateKey)
  }
}
</script>

<style scoped>
</style>
