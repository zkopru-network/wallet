<template>
  <div>
    <h2>Zkopru Browser</h2>
    <div v-if="client">
      <div>Connected to: <span style="font-weight: bold">{{ client.config.url }}</span></div>
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
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ZkopruClient from '@zkopru/client/browser'

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
  async mounted() {
    this.client = await ZkopruClient.create('https://zkopru.goerli.rollupscan.io')
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
    const latestBlockHash = await this.client.node.layer2.latestBlock()
    const latestBlock = await this.client.node.layer2.getProposal(
      latestBlockHash,
    )
    if (!latestBlock) throw new Error(`Unable to find hash: ${latestBlockHash}`)
    if (typeof latestBlock.canonicalNum !== 'number') {
      throw new Error('Latest block does not include canonical number')
    }
    this.latestBlock = latestBlock.canonicalNum
    const highestProposal = await this.client.node.db.findOne('Proposal', {
      where: {},
      orderBy: { proposalNum: 'desc' },
    })
    this.proposalCount = highestProposal.proposalNum
  }
}
</script>

<style scoped>
</style>
