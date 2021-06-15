<template>
  <div class="container">
    <Header showBackButton=true prevPath="/wallet" />
    <div spacer style="height: 44px" />
    <AssetDropdown />
    <div container style="display: flex; justify-content: center; flex: 1; width: 100vw; align-self: center">
      <div style="flex: 1; max-width: 462px">
        <div spacer style="height: 55px" />
        <div>
          Send
        </div>
        <div spacer style="height: 20px" />
        <div style="display: flex; width: 100%">
          00.00
          <div spacer style="flex: 1" />
          CRO
        </div>
        <div style="height: 1px; background: #95A7AE; margin-top: 4.5px; margin-bottom: 3px" />
        <div style="display: flex; width: 100%; font-size: 9px">
          00.00
          <div spacer style="flex: 1" />
          USD
        </div>
        <div spacer style="height: 42px" />
        <div>
          to Zkopru address
        </div>
        <div spacer style="height: 21px" />
        <AddressField />
        <div spacer style="height: 32px" />
        <div style="display: flex; align-items: center">
          Transaction Fee
          <div style="height: 1px; flex: 1; background: #5D7078; margin: 0px 8px" />
          200 Gwei
        </div>
        <div spacer style="height: 39px" />
        <Button buttonStyle="background: #00FFD1; color: #0E2936">
          SEND
        </Button>
        <div spacer style="height: 39px" />
        <div style="display: flex; align-items: center">
          Remaining balance
          <div style="height: 1px; flex: 1; background: #5D7078; margin: 0px 8px" />
          0 CRO
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Header from './components/Header'
import AssetDropdown from './components/AssetDropdown'
import Button from './components/Button'
import AddressField from './components/AddressField'

@Component({
  name: 'Transfer',
  components: { Header, AssetDropdown, Button, AddressField, },
})
export default class Transfer extends Vue {
  async mounted() {

  }
}
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 8px;
  padding-right: 8px;
  color: #95A7AE;
  font-size: 12px;
}
</style>
