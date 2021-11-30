<template>
  <CenteredLeftMenu>
    <div spacer style="height: 70px" />
    <div class="section-container">
      <div>
        <div class="title-text">
          Withdraw
        </div>
        <div spacer style="height: 30px" />
        <div class="detail-text" style="display: flex; align-items: center">
          <img :src="require('../assets/hot_tip.svg')" />
          <div spacer style="width: 10px" />
          Quick Withdraw available via user-funded lending system.
        </div>
        <div spacer style="height: 8px" />
        <div
          :class="`selectable-row ${selectedOption === 2 && 'selectable-active'}`"
          v-on:click="selectedOption = 2"
        >
          <img :src="require('../assets/lightning.svg')" />
          <div spacer style="width: 10px" />
          <div>Quick Withdrawal</div>
          <div spacer style="width: 8px" />
          <div class="selectable-detail-text">(Completion times vary)</div>
          <div spacer style="flex: 1" />
          <InfoText
            :text="tooltips.WITHDRAW_INSTANT"
          />
        </div>
        <div
          :class="`selectable-row ${selectedOption === 1 && 'selectable-active'}`"
          v-on:click="selectedOption = 1"
        >
          <img :src="require('../assets/hour_glass.svg')" />
          <div spacer style="width: 10px" />
          <div>Standard Withdrawal</div>
          <div spacer style="width: 8px" />
          <div class="selectable-detail-text">(~7 days)</div>
          <div spacer style="flex: 1" />
          <InfoText
            :text="tooltips.WITHDRAW_STANDARD"
          />
        </div>
      </div>
    </div>
    <NextButton
      :disabled="selectedOption === 0"
      :onNext="() => $router.push(`/wallet/withdraw?type=${selectedOption}`)"
    />
  </CenteredLeftMenu>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import CenteredLeftMenu from './components/CenteredLeftMenu'
import NextButton from './components/NextButton'
import tooltips from './tooltips'
import InfoText from './components/InfoText'

@Component({
  name: 'WithdrawType',
  components: { CenteredLeftMenu, NextButton, InfoText, },
})
export default class WithdrawType extends Vue {
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
  color: #79FFCF;
  font-size: 12px;
}
.selectable-detail-text {
  font-size: 12px;
  color: #95A7AE;
}
.selectable-row {
  display: flex;
  background-color: #192C35;
  border-radius: 8px;
  align-items: center;
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
</style>
