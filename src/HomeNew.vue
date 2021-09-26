<template>
  <div class="container" :style="`background-image: url(${require('../assets/landing_background.jpg')})`">
    <div style="display: flex; justify-content: space-between; align-items: center">
      <div style="font-weight: 300; font-size: 24px; letter-spacing: 0.16em">
        ZKOPRU
      </div>
      <div class="round-button">
        Open A Wallet
      </div>
    </div>
    <div spacer style="height: 200px" />
    <div style="font-weight: 800; font-size: 120px; max-width: 900px; letter-spacing: -0.01em; color: #F2F2F2; line-height: 100%">
      More than a crypto wallet
    </div>
    <div spacer style="height: 72px" />
    <div style="display: flex; justify-content: space-between">
      <div spacer style="width: 10%" />
      <div class="detail-text" style="max-width: 500px">
        Zkopru is a new protocol for the storage of crypto assets and gas-efficient private transactions on the Ethereum blockchain.
      </div>
      <div class="detail-text" style="max-width: 500px">
        Zkopru wallets can be used to store and send ETH, ERC-20s, and NFTs anonymously at a lower cost than main net transfers.
      </div>
    </div>
    <div spacer style="height: 270px" />
    <div style="display: flex; justify-content: space-around">
      <div style="display: flex; flex-direction: column; max-width: 760px">
        <div class="section-title-text">
          Function
        </div>
        <div spacer style="height: 24px" />
        <div style="color: #F2F2F2; font-weight: bold; font-size: 56px">
          Private and affordable
        </div>
        <div spacer style="height: 40px" />
        <div class="detail-text">
          Zero knowledge proofs make private transactions possible while optimistic rollup technology lowers the cost to send tokens and NFTs on Ethereum’s Layer 2.
        </div>
        <div spacer style="height: 40px" />
        <div style="display: flex">
          <div class="round-button">
            Open A Wallet
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column">
        <div style="color: #F2F2F2; font-size: 24px; font-weight: bold">
          Store + Send
        </div>
        <div spacer style="height: 32px" />
        <div
          style="display: flex; align-items: center; margin-bottom: 32px"
          v-for="item of ['ETH', 'NFT', 'ERC-20']"
        >
          <img :src="require('../assets/add_icon.svg')" width="24px" height="24px" />
          <div spacer style="width: 28px" />
          <div style="color: #F2F2F2; font-size: 24px; font-weight: 300">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div spacer style="height: 270px" />
    <div style="display: flex; justify-content: space-around; flex-wrap: wrap">
      <div class="gas-table-container">
        <div style="color: #F2F2F2; font-weight: bold; font-size: 40px">Gas</div>
        <div>per transaction</div>
        <div spacer style="height: 48px" />
        <div style="display: flex; justify-content: space-between; color: #9EFFEE">
          <div>Zkopru private tx</div>
          <div>8,800</div>
        </div>
        <div spacer style="height: 20px" />
        <div style="width: 10%; height: 12px; background: #9EFFEE; border-radius: 24px;" />
        <div spacer style="height: 20px" />
        <div style="display: flex; justify-content: space-between; color: #F49F2F">
          <div>Ethereum public tx</div>
          <div>22,000</div>
        </div>
        <div spacer style="height: 20px" />
        <div style="width: 22%; height: 12px; background: #F49F2F; border-radius: 24px;" />
        <div spacer style="height: 20px" />
        <div style="display: flex; justify-content: space-between; color: #F49F2F">
          <div>Token public tx</div>
          <div>50-100K</div>
        </div>
        <div spacer style="height: 20px" />
        <div style="width: 100%; height: 12px; background: #F49F2F; border-radius: 24px;" />
        <div spacer style="height: 20px" />
      </div>
      <div style="display: flex; flex-direction: column; max-width: 400px; margin: 16px">
        <div class="section-title-text">
          Scalability
        </div>
        <div spacer style="height: 24px" />
        <div class="section-subtitle-text">
          Low-cost transactions
        </div>
        <div spacer style="height: 40px" />
        <div class="detail-text">
          Optimistic UTXO-based rollups make private transactions possible at a lower cost than main net transfers.
        </div>
      </div>
    </div>
    <div spacer style="height: 230px" />
    <div style="align-self: center; color: #F2F2F2; font-size: 40px; font-weight: bold;">
      Expansive token library
    </div>
    <div spacer style="height: 40px" />
    <div class="detail-text" style="align-self: center; text-align: center">
      Send and receive from an extensive list of ERC-20 tokens and register your own.
    </div>
    <div spacer style="height: 80px" />
    <div style="display: flex; align-self: center; justify-content: space-around; flex-wrap: wrap">
      <div v-for="token of tokenList" style="margin: 8px 32px">
        <img
          :src="require(`../assets/token_icons/${token}.svg`)"
          width="64"
          height="64"
        />
      </div>
    </div>
    <div spacer style="height: 220px" />
    <div style="display: flex; flex-direction: column; max-width: 890px">
      <div class="section-title-text">
        Features
      </div>
      <div spacer style="height: 24px" />
      <div class="section-subtitle-text">
        Secure and convenient
      </div>
      <div spacer style="height: 40px" />
      <div class="detail-text">
        Enjoy a privacy focused Layer 2 wallet with lower transaction costs.
      </div>
      <div spacer style="height: 72px" />
      <div style="display: flex; flex-wrap: wrap">
        <div v-for="data of featuresSection" style="width: 350px; margin: 34px">
          <img
            :src="data.image"
            width="72"
            height="72"
          />
          <div spacer style="height: 40px" />
          <div style="font-size: 24px; font-weight: 300; color: white">
            {{ data.title }}
          </div>
          <div spacer style="height: 16px" />
          <div class="detail-text">
            {{ data.description }}
          </div>
        </div>
      </div>
    </div>
    <div spacer style="height: 200px" />
    <div style="display: flex; align-items: center; flex-wrap: wrap">
      <img
        style="mix-blend-mode: difference; opacity: 0.6"
        :src="require('../assets/landing_eth.svg')"
      />
      <div style="display: flex; flex-direction: column; max-width: 540px">
        <div class="section-title-text">
          Value
        </div>
        <div spacer style="height: 24px" />
        <div class="section-subtitle-text">
          Contributing to the Ecosystem
        </div>
        <div spacer style="height: 40px" />
        <div class="detail-text">
          Zkopru is an open-source, public good built on Ethereum. The privacy wallet is available to everyone at no cost.
        </div>
        <div spacer style="height: 40px" />
        <div style="display: flex">
          <div class="round-button">
            Read More
          </div>
        </div>
      </div>
    </div>
    <div spacer style="height: 200px" />
    <div style="align-self: center; color: #F2F2F2; font-size: 40px; font-weight: bold;">
      Validated Security
    </div>
    <div spacer style="height: 40px" />
    <div class="detail-text" style="align-self: center; text-align: center">
      Zkopru has been audited by Least Authority and Igor Gulamov.
    </div>
    <div spacer style="height: 40px" />
    <div class="round-button" style="align-self: center">
      View Audit Results
    </div>
    <div spacer style="height: 230px" />
    <div style="display: flex; flex-direction: column; align-self: center">
      <div class="section-title-text">
        Creation
      </div>
      <div spacer style="height: 24px" />
      <div class="section-subtitle-text">
        Trusted Setup
      </div>
      <div spacer style="height: 40px" />
      <div style="display: flex; flex-wrap: wrap">
        <div class="detail-text" style="max-width: 500px; margin-bottom: 50px">
          Zkopru was set up using a two–phase process to enhance security. 
          <br />
          <br />
          Phase 1: Perpetual Powers of Tau Ceremony.
          <br />
          Phase 2: Circuit–specific MPC.
          <br />
          <br />
          <span style="font-weight: bold">Phase 1</span> used the output of Iden3’s selection process based on the 54th Perpetual Powers of Tau contribution.
        </div>
        <div spacer style="width: 100px" />
        <div class="detail-text" style="max-width: 500px">
          <span style="font-weight: bold">Phase 2</span> saw to a separate trusted set up for each SNARK that the Zkopru network relies on. This circuit-specific ceremony ensures that no one is able to fake proofs and steal user funds or compromise privacy.
          <br />
          <br />
 The setup is performed in such a way that, to fake a proof, an attacker must compromise every single participant of the ceremony. Therefore, the security goes up with the number of participants.
        </div>
      </div>
    </div>
    <div spacer style="height: 80px" />
    <div style="width: calc(100% + 128px); height: 2px; background: #2A3D46; margin: 0px -64px; margin-bottom: 8px" />
    <div style="display: flex; align-items: center; flex-wrap: wrap">
      <div class="round-button">
        All Ceremony Data
      </div>
      <div spacer style="flex: 1" />
      <div style="display: flex; flex-direction: column; margin: 25px 50px">
        <div style="color: white; font-size: 56px">
          5147
        </div>
        <div class="detail-text">
          Contributions
        </div>
      </div>
      <div style="display: flex; flex-direction: column; margin: 25px 50px">
        <div style="color: white; font-size: 56px">
          369
        </div>
        <div class="detail-text">
          Contributors
        </div>
      </div>
      <div style="display: flex; flex-direction: column; margin: 25px 50px">
        <div style="color: white; font-size: 56px">
          16
        </div>
        <div class="detail-text">
          Circuits
        </div>
      </div>
    </div>
    <div style="width: calc(100% + 128px); height: 2px; background: #2A3D46; margin: 0px -64px; margin-top: 8px" />
    <div spacer style="height: 200px" />
    <div style="align-self: center; color: #F2F2F2; font-size: 40px; font-weight: bold;">
      Earning = Giving
    </div>
    <div spacer style="height: 40px" />
    <div class="detail-text" style="align-self: center; max-width: 900px; text-align: center">
      Collect revenue from transaction fees and simultaneously help Zkopru grow by becoming a network coordinator.
    </div>
    <div spacer style="height: 40px" />
    <div class="round-button" style="align-self: center">
      Learn How
    </div>
    <div spacer style="height: 136px" />
    <div style="background: black; color: #F2F2F2; display: flex; justify-content: space-around; width: calc(100% + 128px); padding: 200px 0px; flex-wrap: wrap; margin: -64px; margin-top: 0px">
      <div style="font-weight: 300; font-size: 48px; latter-spacing: 0.16em; color: white; margin-bottom: 16px">
        ZKOPRU
      </div>
      <div style="display: flex">
        <div style="flex-direction: column">
          <div style="font-size: 24px; font-weight: bold">
            Connect
          </div>
          <div spacer style="height: 32px" />
          <div class="footer-link">
            <img :src="require('../assets/landing_twitter_icon.svg')" />
            <div spacer style="width: 24px" />
            <div>
              Twitter
            </div>
          </div>
          <div spacer style="height: 24px" />
          <div class="footer-link">
            <img :src="require('../assets/landing_medium_icon.svg')" />
            <div spacer style="width: 24px" />
            <div>
              Medium
            </div>
          </div>
        </div>
        <div spacer style="width: 150px" />
        <div style="flex-direction: column">
          <div style="font-size: 24px; font-weight: bold">
            Deploy
          </div>
          <div spacer style="height: 32px" />
          <div class="footer-link">
            <img :src="require('../assets/landing_github_icon.svg')" />
            <div spacer style="width: 24px" />
            <div>
              GitHub
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="position: fixed; top: 0px; left: 0px; right: 0px; bottom: 0px; background: black; z-index: -99" />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'LandingPage',
})
export default class LandingPage extends Vue {
  tokenList = [
    'GNT',
    'UNI',
    'ZRX',
    'USDC',
    'ETH',
    'DAI',
    'LINK',
    'MKR',
    'REP',
  ]

  featuresSection = [
    {
      image: require('../assets/landing_zksnark.svg'),
      title: 'zkSNARK',
      description: 'Zero knowledge proofs make individual transactions private & secure.',
    },
    {
      image: require('../assets/landing_l2.svg'),
      title: 'Optimistic Rollup',
      description: 'Reduced transaction costs on Ethereum’s Layer 2.',
    },
    {
      image: require('../assets/landing_2in1.svg'),
      title: 'Multi-Asset Deposit',
      description: 'ETH can be deposited with any ERC-20 or NFT to reduce gas costs.',
    },
    {
      image: require('../assets/landing_lightning.svg'),
      title: 'Quick Withdrawals',
      description: 'Skip the 7-day standard withdraw period via user-funded lending system.',
    }
  ]
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 64px;
  color: white;
  max-width: 1400px;
  overflow-x: hidden;
  margin: auto;
  background-size: contain;
}
.round-button {
  cursor: pointer;
  user-select: none;
  background: #9EFFEE;
  border-radius: 27px;
  padding: 10px 32px;
  color: black;
  font-size: 21px;
}
.section-title-text {
  text-transform: uppercase;
  color: #9EFFEE;
  font-weight: 300;
  font-size: 18px;
}
.section-subtitle-text {
  font-size: 56px;
  font-weight: bold;
  color: #F2F2F2;
}
.detail-text {
  font-size: 24px;
  font-weight: 300;
  color: #919D9B;
}
.gas-table-container {
  background: #081B24;
  border: 1px solid #5D7078;
  border-radius: 32px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  width: 450px;
}
.footer-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
</style>
