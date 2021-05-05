<template>
  <div class="withdraw-container">
    <div class="withdraw-text">
      Move L2 assets to L1
    </div>
    <div spacer style="height: 24px" />
    <div class="withdraw-text">
      From Zkopru
    </div>
    <div spacer style="height: 8px" />
    <div class="withdraw-text">
      {{ $store.state.zkopru.shortZkAddress }}
    </div>
    <div spacer style="height: 32px" />
    <div class="withdraw-text">
      To Metamask
    </div>
    <div spacer style="height: 8px" />
    <div class="withdraw-text">
      {{ $store.state.account.accounts[0] }}
    </div>
    <div spacer style="height: 32px" />
    <Button :onClick="() => showWithdraw()">
      Withdraw
    </Button>
    <WithdrawAmountPopup
      :visible="showingWithdraw"
      :onCancel="() => showingWithdraw = false"
      :onComplete="() => showingWithdraw = false"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Button from './Button'
import WithdrawAmountPopup from './WithdrawAmountPopup'

@Component({
  name: 'WalletWithdraw',
  components: { Button, WithdrawAmountPopup, },
})
export default class WalletWithdraw extends Vue {
  showingWithdraw = false
  showWithdraw() {
    this.showingWithdraw = true
  }
}
</script>

<style scoped>
.withdraw-container {
  display: flex;
  flex-direction: column;
  padding-left: 75px;
  padding-right: 75px;
}
.withdraw-text {
  font-size: 18px;
  color: white;
}
</style>
