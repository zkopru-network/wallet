<template>
  <div class="container">
    <div class="header-container" v-if="!showingConnect">
      <div class="header-text-container">
        <div class="header-name">
          zkopru wallet
        </div>
        <div style="display: flex">
          <div class="header-link">
            About
          </div>
          <div spacer style="width: 32px" />
          <div class="header-link">
            Features
          </div>
        </div>
      </div>
      <div class="title-text">
        Private and affordable transactions on the Ethereum blockchain.
      </div>
      <div spacer style="height: 60px" />
      <Button :onClick="() => showingConnect = true">
        Open a wallet
      </Button>
      <div spacer style="height: 48px" />
      <div style="display: flex; flex-direction: column; align-items: center">
        <div class="learn-more">
          Learn more
        </div>
        <div spacer style="height: 16px" />
        <img src="../assets/arrow_down.svg" />
      </div>
      <div class="background-text" />
    </div>
    <div class="header-container" v-if="showingConnect" style="align-items: center">
      <div class="header-text-container" style="justify-content: center">
        <div class="header-name">
          zkopru wallet
        </div>
      </div>
      <div spacer style="height: 120px" />
      <div style="font-size: 48px; color: white; font-weight: bold">
        Get started
      </div>
      <div spacer style="height: 26px" />
      <img src="../assets/metamask.png" width="200px" height="200px" />
      <div spacer style="height: 32px" />
      <Button :onClick="() => connectMetamask()">
        Connect Metamask
      </Button>
      <div spacer style="height: 48px" />
      <div class="underline-button" v-on:click="showingConnect = false">
        Cancel
      </div>
      <div class="background-text" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Button from './components/Button'

@Component({
  name: 'Home',
  components: { Button, },
  metaInfo: {
    title: 'Zkopru Wallet',
  },
})
export default class Home extends Vue {
  showingConnect = false

  async connectMetamask() {
    try {
      await this.$store.dispatch('connectMetamask')
      this.$router.push('/wallet')
    } catch (err) {
      
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.header-container {
  width: 100vw;
  height: 100vh;
  min-height: 600px;
  background: radial-gradient(
    127.44% 155.53% at 93.41% 11.94%,
    rgba(14, 41, 54, 0.65) 73.7%,
    rgba(0, 255, 209, 0.15) 100%
  );
  /* background-blend-mode: hard-light; */
  display: flex;
  flex-direction: column;
}
.header-text-container {
  display: flex;
  justify-content: space-between;
  padding: 24px;
}
.header-link {
  color: white;
  font-weight: 500;
  font-size: 18px;
}
.header-name {
  font-weight: bold;
  font-size: 32px;
  color: white;
}
.background-text {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-image: url('../assets/zkopru.svg');
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
}
.title-text {
  font-size: 64px;
  color: white;
  align-self: center;
  text-align: center;
  max-width: 1132px;
  padding-left: 160px;
  padding-right: 160px;
  padding-top: 120px;
}
.learn-more {
  color: #D0FFF7;
  font-size: 18px;
  align-self: center;
}
.underline-button {
  cursor: pointer;
  text-decoration: underline;
  color: #D0FFF7;
  font-size: 18px;
}
</style>
