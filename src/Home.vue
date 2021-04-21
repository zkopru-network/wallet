<template>
  <div>
    <h2>Zkopru Browser Node</h2>
    <div v-if="!client">
      <span style="font-weight: bold">Loading...</span>
    </div>
    <div v-if="client && client.node">
      <div>
        Address:
        <a :href="`https://goerli.etherscan.io/address/${client.node.layer1.address}`">
          {{ client.node.layer1.address }}
        </a>
      </div>
      <div>
        <h4>Sync info:</h4>
        <div>
          Status: <span style="font-weight: bold">{{ status }}</span>
        </div>
        <div>
          Proposal Count: {{ proposalCount }}
        </div>
        <div>
          Current Block: {{ latestBlock }}
        </div>
      </div>
      <div>
        <h4>Wallet</h4>
        <div v-if="!wallet">
          <button v-on:click="createWallet">Create Wallet</button>
        </div>
        <div v-if="wallet">
          <div>{{ wallet.account.ethAddress }}</div>
          <div>{{ wallet.account.zkAddress.address }}</div>
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
  client = null
  latestBlock = 0
  proposalCount = 0
  status = 'on syncing'
  wallet = null
  async mounted() {
    this.client = new Zkopru.Node({
      websocket: 'wss://goerli.infura.io/ws/v3/5b122dbc87ed4260bf9a2031e8a0e2aa',
    })
    await this.client.start()
    this.client.node.synchronizer.on('onFetched', async () => this.update())
    this.client.node.synchronizer.on('status', async () => this.update())
    setInterval(async () => {
      await this.update()
    }, 5000)
    await this.update()
  }

  async update() {
    this.status = this.client.node.synchronizer.status
    const highestProposal = await this.client.node.db.findOne('Proposal', {
      where: {},
      orderBy: { proposalNum: 'desc' },
    })
    this.proposalCount = highestProposal.proposalNum
    const latestBlockHash = await this.client.node.layer2.latestBlock()
    const latestBlock = await this.client.node.layer2.getProposal(
      latestBlockHash,
    )
    if (!latestBlock) throw new Error(`Unable to find hash: ${latestBlockHash}`)
    if (typeof latestBlock.canonicalNum !== 'number') {
      throw new Error('Latest block does not include canonical number')
    }
    this.latestBlock = latestBlock.canonicalNum
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
