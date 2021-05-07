<template>
  <div style="position: absolute">
    <transition name="fade">
      <div
        class="background-overlay"
        v-if="visible"
        v-on:click="_onClose"
      />
    </transition>
    <transition name="slide">
      <div class="settings-container" v-if="visible">
        <div style="display: flex; justify-content: space-between">
          <div class="settings-header-text">
            zkopru settings
          </div>
          <img
            style="cursor: pointer"
            src="../../assets/close-settings.svg"
            v-on:click="_onClose"
            width="20px"
            height="auto"
          />
        </div>
        <div spacer style="height: 26px" />
        <div class="settings-subheader-text">
          Account
        </div>
        <div spacer style="height: 26px" />
        <div class="settings-account-address">
          {{ $store.state.zkopru.zkAddress || 'No address authenticated' }}
        </div>
        <div spacer style="height: 18px" />
        <div class="horizontal-divider" />
        <div spacer style="height: 18px" />
        <div style="display: flex; justify-content: space-between">
          <div class="settings-check-text">
            Allow auto sync of Zkopru blockchain
          </div>
          <Checkbox
            v-model:checked="$store.state.wallet.autosyncEnabled"
            :onChange="() => $store.dispatch('saveState')"
          />
        </div>
        <div spacer style="height: 24px" />
        <Button :onClick="() => showingClearDataPopup = true">
          Clear Data
        </Button>
        <ClearDataPopup
          :visible="showingClearDataPopup"
          :onCancel="() => showingClearDataPopup = false"
        />
        <div spacer style="flex: 1" />
        <div class="build-number">
          build {{ currentbuild }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Checkbox from './Checkbox'
import Button from './Button'
import ClearDataPopup from './ClearDataPopup'
import buildnum from '../buildnum'

@Component({
  name: 'SettingsPanel',
  components: { Checkbox, Button, ClearDataPopup, },
  props: [ 'onClose', 'visible', ],
})
export default class SettingsPanel extends Vue {
  currentbuild = buildnum
  showingClearDataPopup = false

  _onClose() {
    if (typeof this.onClose === 'function') {
      this.onClose()
    }
  }
}
</script>

<style scoped>
.settings-container {
  width: 508px;
  position: fixed;
  top: 0px;
  left: 0px;
  bottom: 0px;
  background-color: #081B24;
  padding: 16px;
  z-index: 10;
  display: flex;
  flex-direction: column;
}
.settings-header-text {
  font-size: 32px;
  color: #D0FFF7;
  font-weight: bold;
}
.settings-subheader-text {
  font-size: 24px;
  color: #D0FFF7;
  letter-spacing: 0.1em;
  font-weight: bold;
}
.background-overlay {
  background-color: rgba(8, 27, 36, 0.5);
  position: fixed;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  z-index: 10;
}
.settings-account-address {
  color: white;
  font-size: 18px;
  max-width: 100%;
  word-break: break-all;
}
.build-number {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}
.horizontal-divider {
  height: 1px;
  background-color: #A3B1B7;
}
.settings-check-text {
  color: #D0FFF7;
  font-size: 18px;
}
.slide-enter, .slide-leave-to {
  /* width + padding */
  left: -540px;
}
.slide-enter-active, .slide-leave-active {
  transition: left 0.4s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
</style>
