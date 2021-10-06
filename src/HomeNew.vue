<template>
  <div
    class="container"
    :style="`
      background-image: url(${require('../assets/landing_background.jpg')});
      padding: 0px ${horizontalPadding}px;
    `"
    >
    <div spacer style="height: 64px" />
    <div style="display: flex; justify-content: space-between; align-items: center">
      <div style="font-weight: 300; font-size: 24px; letter-spacing: 0.16em">
        ZKOPRU
      </div>
      <div class="round-button">
        Open Wallet
      </div>
    </div>
    <div spacer :style="`height: ${$store.state.interface.isMobile ? '47px' : '200px'}`" />
    <div :style="`font-weight: 800; font-size: ${$store.state.interface.isMobile ? '48px' : '106px'}; max-width: 1200px; letter-spacing: -0.01em; color: #F2F2F2; line-height: 100%`">
      Affordable Ethereum Privacy Wallet
    </div>
    <div spacer :style="`height: ${$store.state.interface.isMobile ? '48px' : '72px'}`" />
    <div style="display: flex; justify-content: space-between; flex-wrap: wrap">
      <div spacer v-if="!$store.state.interface.isMobile" style="width: 10%" />
      <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`" style="max-width: 500px; margin-bottom: 24px">
        Zkopru is a new protocol for the storage of crypto assets and gas-efficient private transactions on the Ethereum blockchain.
      </div>
      <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`" style="max-width: 500px">
        Zkopru wallets can be used to store and send ETH, ERC-20s, and NFTs anonymously at a lower cost than main net transfers.
      </div>
    </div>
    <div spacer :style="`height: ${$store.state.interface.isMobile ? '96px' : '270px'}`" />
    <div style="display: flex; flex-wrap: wrap">
      <div style="display: flex; flex-direction: column; max-width: 659px">
        <div class="section-title-text">
          Function
        </div>
        <div spacer style="height: 24px" />
        <div :class="`section-subtitle-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
          Private and affordable
        </div>
        <div spacer style="height: 40px" />
        <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
          Zero knowledge proofs make private transactions possible while optimistic rollup technology lowers the cost to send tokens and NFTs on Ethereum’s Layer 2.
        </div>
        <div spacer style="height: 40px" />
        <div style="display: flex">
          <div class="round-button">
            Open Wallet
          </div>
        </div>
      </div>
      <div style="display: flex; flex: 1" />
      <div style="display: flex; flex-direction: column">
        <div spacer style="height: 80px" />
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
      <div style="display: flex; flex: 1" />
    </div>
    <div spacer :style="`height: ${$store.state.interface.isMobile ? '96px' : '270px'}`" />
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between">
      <div v-if="!$store.state.interface.isMobile" class="gas-table-container">
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
      <div style="display: flex; flex-direction: column; max-width: 500px">
        <div class="section-title-text">
          Scalability
        </div>
        <div spacer style="height: 24px" />
        <div :class="`section-subtitle-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
          Low-cost transactions
        </div>
        <div spacer style="height: 40px" />
        <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
          Optimistic UTXO-based rollups make private transactions possible at a lower cost than main net transfers.
        </div>
      </div>
      <div v-if="$store.state.interface.isMobile" class="gas-table-container" style="margin-top: 24px">
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
    </div>
    <div spacer :style="`height: ${$store.state.interface.isMobile ? '92px' : '230px'}`" />
    <div style="align-self: center; color: #F2F2F2; font-size: 40px; font-weight: bold;">
      Expansive token library
    </div>
    <div spacer style="height: 40px" />
    <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`" style="align-self: center; text-align: center">
      Send and receive from an extensive list of ERC-20 tokens and register your own.
    </div>
    <div spacer style="height: 80px" />
    <div :style="`display: flex; align-self: center; justify-content: space-around; ${$store.state.interface.isMobile ? 'flex-wrap: wrap;' : 'overflow: hidden'}`">
      <div v-for="token of tokenList" style="margin: 8px 32px">
        <img
          :src="require(`../assets/token_icons/${token}.svg`)"
          width="64"
          height="64"
          :style="`opacity: ${1-(Math.abs(tokenList.indexOf(token) - tokenList.length / 2) / (tokenList.length / 1.7))}`"
        />
      </div>
    </div>
    <div spacer :style="`height: ${$store.state.interface.isMobile ? '80px' : '220px'}`" />
    <div style="display: flex; flex-direction: column; max-width: 1160px">
      <div class="section-title-text">
        Features
      </div>
      <div spacer style="height: 24px" />
      <div :class="`section-subtitle-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
        Secure and convenient
      </div>
      <div spacer style="height: 40px" />
      <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
        Enjoy a privacy focused Layer 2 wallet with lower transaction costs.
      </div>
      <div spacer style="height: 72px" />
      <div style="display: flex; flex-wrap: wrap">
        <div v-for="data of featuresSection" style="width: 420px; margin: 34px">
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
          <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
            {{ data.description }}
          </div>
        </div>
      </div>
    </div>
    <div spacer :style="`height: ${$store.state.interface.isMobile ? '96px' : '200px'}`" />
    <div style="display: flex; align-items: center; flex-wrap: wrap; justify-content: space-between">
      <img
        style="mix-blend-mode: difference; opacity: 0.6"
        :src="require('../assets/landing_eth.svg')"
      />
      <div style="display: flex; flex-direction: column; max-width: 500px">
        <div class="section-title-text">
          Value
        </div>
        <div spacer style="height: 24px" />
        <div :class="`section-subtitle-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
          Contributing to the Ecosystem
        </div>
        <div spacer style="height: 40px" />
        <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
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
    <div spacer :style="`height: ${$store.state.interface.isMobile ? '92px' : '200px'}`" />
    <div style="align-self: center; color: #F2F2F2; font-size: 40px; font-weight: bold;">
      Validated Security
    </div>
    <div spacer style="height: 40px" />
    <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`" style="align-self: center; text-align: center">
      Zkopru has been audited by <span style="color: white">Least Authority</span> and <span style="color: white">Igor Gulamov</span>.
    </div>
    <div spacer style="height: 40px" />
    <div class="round-button" style="align-self: center">
      View Audit Results
    </div>
    <div spacer :style="`height: ${$store.state.interface.isMobile ? '96px' : '230px'}`" />
    <div :style="`position: relative; left: -${horizontalPadding}px; right: -${horizontalPadding}px; width: 100vw; height: 2px; background: #2A3D46`" />
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; position: relative; padding: 88px 0px;">
      <div style="display: flex; flex-direction: column">
        <div class="section-title-text">
          Creation
        </div>
        <div spacer style="height: 24px" />
        <div :class="`section-subtitle-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
          Trusted Setup
        </div>
        <div spacer style="height: 40px" />
        <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`" style="max-width: 500px; margin-bottom: 50px">
          Zkopru was set up using a two–phase process to enhance security. 
          <br />
          <br />
          Phase 1: Perpetual Powers of Tau Ceremony
          <br />
          Phase 2: Circuit–specific setup
          <br />
          <br />
          <span style="font-weight: bold">Phase 1 had 71 contributors</span>
          <span style="font-weight: 400">used the output of Iden3’s selection process based on the 54th Perpetual Powers of Tau contribution.</span>
        </div>
      </div>
      <div
        v-if="$store.state.interface.width > 1200"
        style="position: absolute; left: calc(50% - 1px); right(50% - 1px); top: 0px; bottom: 0px; width: 2px; background: #2A3D46"
      />
      <div style="display: flex; flex-direction: column">
        <div spacer v-if="!$store.state.interface.isMobile" style="height: 150px" />
        <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`" style="max-width: 500px;">
          <span style="font-weight: bold">Phase 2 circuit-specific ceremony</span>  was held to ensure that no one is able to fake proofs to steal user funds or compromise privacy.
          <br />
          <br />
 The setup is performed in such a way that, to fake a proof, an attacker must compromise every single contributor in the ceremony. Therefore, the security goes up with the number of contributors.
        </div>
      </div>
    </div>
    <div :style="`position: relative; left: -${horizontalPadding}px; right: ${horizontalPadding}px; width: 100vw; height: 2px; background: #2A3D46`" />
    <div style="display: flex; align-items: center; flex-wrap: wrap; padding: 8px 0px; position: relative">
      <div class="round-button">
        All Ceremony Data
      </div>
      <div spacer style="display: flex; flex: 1" />
      <div
        v-if="$store.state.interface.width > 1200"
        style="position: absolute; left: calc(50% - 1px); right(50% - 1px); top: 0px; bottom: 0px; width: 2px; background: #2A3D46"
      />
      <div spacer style="display: flex; flex: 1" />
      <div style="display: flex; flex-direction: column; margin: 25px 0px">
        <div style="color: white; font-size: 56px">
          5147
        </div>
        <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
          Contributions
        </div>
      </div>
      <div style="display: flex; flex-direction: column; margin: 25px 100px">
        <div style="color: white; font-size: 56px">
          369
        </div>
        <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
          Contributors
        </div>
      </div>
      <div style="display: flex; flex-direction: column; margin: 25px 0px">
        <div style="color: white; font-size: 56px">
          16
        </div>
        <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`">
          Circuits
        </div>
      </div>
    </div>
    <div :style="`position: relative; left: -${horizontalPadding}px; right: ${horizontalPadding}px; width: 100vw; height: 2px; background: #2A3D46`" />
    <div spacer :style="`height: ${$store.state.interface.isMobile ? '92px' : '200px'}`" />
    <div style="align-self: center; color: #F2F2F2; font-size: 40px; font-weight: bold;">
      Earning = Giving
    </div>
    <div spacer style="height: 40px" />
    <div :class="`detail-text ${$store.state.interface.isMobile ? 'mobile' : ''}`" style="align-self: center; max-width: 700px; text-align: center">
      Collect revenue from transaction fees and simultaneously help Zkopru grow by becoming a network coordinator.
    </div>
    <div spacer style="height: 40px" />
    <div class="round-button" style="align-self: center">
      Learn How
    </div>
    <div spacer :style="`height: ${$store.state.interface.isMobile ? '38px' : '136px'}`" />
    <div :style="`background: black; color: #F2F2F2; display: flex; justify-content: space-around; width: calc(100% + ${0}px); padding: 240px ${horizontalPadding}px; flex-wrap: wrap; margin-top: 0px; position: relative; left: -${horizontalPadding}px`">
      <div style="font-weight: 300; font-size: 48px; latter-spacing: 0.16em; color: white; margin-bottom: 16px">
        ZKOPRU
      </div>
      <div spacer style="display: flex; flex: 1" />
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
  computed: {
    horizontalPadding: function horizontalPadding() {
      return Math.min(260, Math.max(32, ((this.$store.state.interface.width - 1162) / 2)))
    },
  }
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
  color: white;
  max-width: 1162px;
  overflow-x: hidden;
  margin: auto;
  background-size: cover;
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
.section-subtitle-text.mobile {
  font-size: 48px;
}
.detail-text {
  font-size: 21px;
  font-weight: 300;
  color: #ACB4B2;
  line-height: 140%;
}
.detail-text.mobile {
  font-size: 16px;
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
