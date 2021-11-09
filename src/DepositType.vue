<template>
  <CenteredLeftMenu>
    <div spacer style="height: 70px" />
    <div class="section-container">
      <div>
        <div class="title-text">
          Deposit
        </div>
        <div spacer style="height: 30px" />
        <div class="detail-text">
          For your convenience, Zkopru offers a multi-asset deposit option. You can deposit ETH at the same time you deposit a different token.
        </div>
        <div spacer style="height: 8px" />
        <div
          :class="`selectable-row ${selectedOption === 1 && 'selectable-active'}`"
          v-on:click="selectedOption = 1"
        >
          <div style="display: flex; align-items: center">
            <div>ETH and Token</div>
            <div spacer style="width: 4px" />
            <InfoText
              :text="tooltips.DEPOSIT_TYPE_BOTH"
            />
          </div>
          <img class="icon-image" :src="require('../assets/deposit_multi.png')" />
        </div>
        <div
          :class="`selectable-row ${selectedOption === 2 && 'selectable-active'}`"
          v-on:click="selectedOption = 2"
        >
          <div>
            <div>Token only</div>
            <!-- info popup here -->
          </div>
          <img class="icon-image" :src="require('../assets/deposit_token.png')" />
        </div>
        <div
          :class="`selectable-row ${selectedOption === 3 && 'selectable-active'}`"
          v-on:click="selectedOption = 3"
        >
          <div>
            <div>ETH only</div>
            <!-- info popup here -->
          </div>
          <img class="icon-image" :src="require('../assets/deposit_eth.png')" />
        </div>
      </div>
    </div>
    <NextButton
      :disabled="selectedOption === 0"
      :onNext="() => $router.push(`/wallet/deposit?type=${selectedOption}`)"
    />
  </CenteredLeftMenu>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import CenteredLeftMenu from './components/CenteredLeftMenu'
import NextButton from './components/NextButton'
import InfoText from './components/InfoText'
import tooltips from './tooltips'

@Component({
  name: 'DepositType',
  components: { CenteredLeftMenu, NextButton, InfoText, },
})
export default class DepositType extends Vue {
  tooltips = tooltips
  selectedOption = 0

  mounted() {
    if (this.$route.query.type && !isNaN(this.$route.query.type)) {
      this.selectedOption = +this.$route.query.type
    }
  }
}
</script>
<style scoped>
.section-container {
  display: flex;
  flex-direction: column;
  max-width: 452px;
  width: 100vw;
  background-color: #081B24;
  border: 1px solid #2A3D46;
  border-radius: 8px;
  padding: 14px;
}
.title-text {
  color: #F2F2F2;
  font-size: 12px;
  font-weight: 600;
}
.detail-text {
  color: #95A7AE;
  font-size: 11px;
}
.selectable-row {
  display: flex;
  background-color: #192C35;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  margin-bottom: 16px;
  padding-left: 13px;
  padding-right: 13px;
  height: 47px;
  color: #95A7AE;
  cursor: pointer;
  /* so the element doesn't jump when selected */
  border: 1px solid transparent;
  font-size: 14px;
  user-select: none;
}
.selectable-active {
  background-color: #05141A;
  border: 1px solid #4C5F67;
  color: white;
}
.icon-image {
  height: 32px;
}
</style>
