<template>
  <div class="left-bar-container">
    <div class="header-item">
      Zkopru
    </div>
    <div class="item selected">
      <div class="image-container">
        <img class="image-icon" :src="require('../../assets/wallet_icon.svg')" />
      </div>
      <div>My Wallet</div>
    </div>
    <div class="item">
      <div class="image-container">
        <img class="image-icon" :src="require('../../assets/deposit_icon.svg')" />
      </div>
      <div>Deposit</div>
    </div>
    <div class="item">
      <div class="image-container">
        <img class="image-icon" :src="require('../../assets/withdraw_icon.svg')" />
      </div>
      <div>Withdraw</div>
    </div>
    <div class="item">
      <div class="image-container">
        <img class="image-icon" :src="require('../../assets/history_icon.svg')" />
      </div>
      <div>History</div>
    </div>
    <div class="item">
      <div class="image-container">
        <img class="image-icon" :src="require('../../assets/token_library_icon.svg')" />
      </div>
      <div>Token Library</div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'LeftMenu',
})
export default class LeftMenu extends Vue {

}
</script>
<style scoped>
.left-bar-container {
  background-color: #05141A;
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
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
}
.image-container {
  min-width: 30px;
  margin-right: 8px;
  text-align: center;
}
.image-icon {
  max-height: 40px;
}
.header-item {
  font-size: 16px;
  font-weight: bold;
  line-height: 140%;
  color: white;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 32px;
  box-shadow: 0px 1px 0px #2A3D46;
  margin-bottom: 24px;
}
</style>
