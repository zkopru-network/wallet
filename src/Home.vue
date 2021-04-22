<template>
  <div class="container">
    <div class="header-container">
      <div class="background-text" />
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
      <Button>
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
  async mounted() {
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
  background-blend-mode: overlay;
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
</style>
