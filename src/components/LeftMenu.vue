<template>
  <div style="width: 200px; height: 100vh">
    <div class="left-bar-container">
      <div class="header-item">
        ZKOPRU
      </div>
      <div style="display: flex; flex: 1; flex-direction: column; border-right: 1px solid #2A3D46;">
        <div spacer style="height: 24px" />
        <div
          :class="`item ${isWallet && 'selected'}`"
          v-on:click="$router.push('/wallet')"
        >
          <div class="image-container">
            <ColorImage
              class="image-icon"
              :src="require('../../assets/wallet_icon.svg')"
              :color="isWallet ? 'white' : '#95A7AE'"
            />
          </div>
          <div>My Wallet</div>
        </div>
        <div
          :class="`item ${isHistory && 'selected'}`"
          v-on:click="$router.push('/wallet/history')"
        >
          <div class="image-container">
            <ColorImage
              class="image-icon"
              :src="require('../../assets/history_icon.svg')"
              :color="isHistory ? 'white' : '#95A7AE'"
            />
          </div>
          <div>History</div>
        </div>
        <div
          :class="`item ${isTokenLibrary && 'selected'}`"
          v-on:click="$router.push('/wallet/library')"
        >
          <div class="image-container">
            <ColorImage
              class="image-icon"
              :src="require('../../assets/token_library_icon.svg')"
              :color="isTokenLibrary ? 'white' : '#95A7AE'"
            />
          </div>
          <div>Token Library</div>
        </div>
        <div class="divider" />
        <div
          :class="`item ${isSend && 'selected'}`"
          v-on:click="$router.push('/wallet/transfer')"
        >
          <div class="image-container">
            <ColorImage
              class="image-icon"
              :src="require('../../assets/send_icon_new.svg')"
              :color="isSend ? 'white' : '#95A7AE'"
            />
          </div>
          <div>Send</div>
        </div>
        <div
          :class="`item ${isReceive && 'selected'}`"
          v-on:click="$router.push('/wallet/receive')"
        >
          <div class="image-container">
            <ColorImage
              class="image-icon"
              :src="require('../../assets/receive_icon_new.svg')"
              :color="isReceive ? 'white' : '#95A7AE'"
            />
          </div>
          <div>Receive</div>
        </div>
        <div class="divider" />
        <div
          :class="`item ${isDeposit && 'selected'}`"
          v-on:click="$router.push('/wallet/deposit/type')"
        >
          <div class="image-container">
            <ColorImage
              class="image-icon"
              :src="require('../../assets/deposit_icon.svg')"
              :color="isDeposit ? 'white' : '#95A7AE'"
            />
          </div>
          <div>Deposit</div>
        </div>
        <div
          :class="`item ${isWithdraw && 'selected'}`"
          v-on:click="$router.push('/wallet/withdraw/type')"
        >
          <div class="image-container">
            <ColorImage
              class="image-icon"
              :src="require('../../assets/withdraw_icon.svg')"
              :color="isWithdraw ? 'white' : '#95A7AE'"
            />
          </div>
          <div>Withdraw</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ColorImage from './ColorImage'

@Component({
  name: 'LeftMenu',
  components: { ColorImage, },
  computed: {
    isWallet() {
      return this.$route.path === '/wallet'
    },
    isDeposit() {
      return this.$route.path.startsWith('/wallet/deposit')
    },
    isWithdraw() {
      return this.$route.path.startsWith('/wallet/withdraw')
    },
    isHistory() {
      return this.$route.path.startsWith('/wallet/history')
    },
    isTokenLibrary() {
      return this.$route.path.startsWith('/wallet/library')
    },
    isSend() {
      return this.$route.path.startsWith('/wallet/transfer')
    },
    isReceive() {
      return this.$route.path.startsWith('/wallet/receive')
    }
  }
})
export default class LeftMenu extends Vue {
  mounted() {
  }
}
</script>
<style scoped>
.left-bar-container {
  background-color: #05141A;
  width: 200px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
}
.item {
  display: flex;
  font-size: 14px;
  color: #95A7AE;
  cursor: pointer;
  user-select: none;
  align-items: center;
  border-radius: 8px;
  height: 40px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding-left: 32px;
  margin-left: 8px;
  margin-right: 8px;
}
.selected {
  background-color: #192C35;
  color: white;
}
.image-container {
  min-width: 30px;
  margin-right: 6px;
  text-align: center;
}
.image-icon {
  max-height: 40px;
}
.header-item {
  font-size: 18px;
  font-weight: 300;
  line-height: 140%;
  letter-spacing: 0.16em;
  color: white;
  padding-top: 10.5px;
  padding-bottom: 10.5px;
  padding-left: 32px;
  box-shadow: 0px 1px 0px #2A3D46;
}
.divider {
  width: calc(100% - 32px);
  height: 1px;
  background-color: #2A3D46;
  margin: 8px 16px;
}
</style>
