<template>
  <div class="transfer-container">
    <div class="transfer-text">
      Transfer
    </div>
    <div spacer style="height: 46px" />
    <div class="transfer-text">
      To
    </div>
    <div spacer style="height: 8px" />
    <input type="text" v-model="destAddress" />
    <div spacer style="height: 32px" />
    <div class="transfer-text">
      From Zkopru
    </div>
    <div spacer style="height: 8px" />
    <div class="transfer-text">
      {{ $store.state.zkopru.shortZkAddress }}
    </div>
    <div spacer style="height: 32px" />
    <Button :onClick="showTransfer">
      Send
    </Button>
    <TransferAmountPopup
      :visible="showingTransfer"
      :onComplete="() => showingTransfer = false"
      :onCancel="() => showingTransfer = false"
      :recipient="destAddress"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Button from './Button'
import TransferAmountPopup from './TransferAmountPopup'

@Component({
  name: 'WalletTransfer',
  components: { Button, TransferAmountPopup, },
})
export default class WalletTransfer extends Vue {
  destAddress = ''
  showingTransfer = false
  showTransfer() {
    this.showingTransfer = true
  }

}
</script>

<style scoped>
.transfer-container {
  display: flex;
  flex-direction: column;
  padding-left: 75px;
  padding-right: 75px;
}
.transfer-text {
  font-size: 18px;
  color: white;
}
</style>
