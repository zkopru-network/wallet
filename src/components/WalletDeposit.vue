<template>
  <div class="deposit-container">
    <div class="deposit-text">
      Add L1 assets to L2
    </div>
    <div spacer style="height: 24px" />
    <div class="deposit-text">
      From Metamask
    </div>
    <div spacer style="height: 8px" />
    <div class="deposit-text">
      {{ $store.state.account.accounts[0] }}
    </div>
    <div spacer style="height: 32px" />
    <div class="deposit-text">
      To Zkopru address
    </div>
    <div spacer style="height: 8px" />
    <div class="deposit-text">
      {{ $store.state.zkopru.shortZkAddress }}
    </div>
    <div spacer style="height: 32px" />
    <Button :onClick="() => showDeposit()">
      Add
    </Button>
    <DepositAmountPopup
      :visible="showingDeposit"
      :onCancel="() => showingDeposit = false"
      :onComplete="() => showingDeposit = false"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Button from './Button'
import DepositAmountPopup from './DepositAmountPopup'

@Component({
  name: 'WalletDeposit',
  components: { Button, DepositAmountPopup, },
})
export default class WalletDeposit extends Vue {
  showingDeposit = false
  showDeposit() {
    this.showingDeposit = true
  }
}
</script>

<style scoped>
.deposit-container {
  display: flex;
  flex-direction: column;
  padding-left: 75px;
  padding-right: 75px;
}
.deposit-text {
  font-size: 18px;
  color: white;
}
</style>
