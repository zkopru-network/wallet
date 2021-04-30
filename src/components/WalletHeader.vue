<template>
  <div class="wallet-header-container">
    <div class="balance-title">
      {{ $store.state.zkopru.balance === null ? '-' : $store.state.zkopru.balance }} ETH
    </div>
    <div spacer style="height: 16px" />
    <div class="balance-subtitle">
      $0 USD
    </div>
    <div spacer style="height: 16px" />
    <div class="button-container">
      <SelectableButton
        class="selectable-button"
        :imgSelected="require('../../assets/deposit_active.svg')"
        :imgUnselected="require('../../assets/deposit_inactive.svg')"
        :selected="depositSelected"
        :onChange="() => depositClicked()"
      />
      <SelectableButton
        class="selectable-button"
        :imgSelected="require('../../assets/transfer_active.svg')"
        :imgUnselected="require('../../assets/transfer_inactive.svg')"
        :selected="transferSelected"
        :onChange="() => transferClicked()"
      />
      <SelectableButton
        class="selectable-button"
        :imgSelected="require('../../assets/withdraw_active.svg')"
        :imgUnselected="require('../../assets/withdraw_inactive.svg')"
        :selected="withdrawSelected"
        :onChange="() => withdrawClicked()"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import SelectableButton from './SelectableButton'

@Component({
  name: 'WalletHeader',
  components: { SelectableButton, },
  props: [ 'mode', ],
  model: {
    prop: 'mode',
    event: 'modeChanged',
  }
})
export default class WalletHeader extends Vue {
  depositSelected = true
  transferSelected = false
  withdrawSelected = false

  depositClicked() {
    this.depositSelected = true
    this.transferSelected = false
    this.withdrawSelected = false
    this.$emit('modeChanged', 0)
  }

  transferClicked() {
    this.depositSelected = false
    this.transferSelected = true
    this.withdrawSelected = false
    this.$emit('modeChanged', 1)
  }

  withdrawClicked() {
    this.depositSelected = false
    this.transferSelected = false
    this.withdrawSelected = true
    this.$emit('modeChanged', 2)
  }
}
</script>

<style scoped>
.wallet-header-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 212px;
  padding-top: 26px;
  padding-left: 75px;
  padding-right: 75px;
}
.balance-title {
  color: white;
  font-weight: 300;
  font-size: 64px;
}
.balance-subtitle {
  color: white;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.1em;
}
.button-container {
  display: flex;
  align-items: center;
}
.selectable-button {
  margin: 8px;
}
</style>
