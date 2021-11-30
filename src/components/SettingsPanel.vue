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
        <div class="settings-subheader-text">
          Your Zkopru Address
        </div>
        <div spacer style="height: 26px" />
        <div class="settings-account-address">
          {{ $store.state.zkopru.zkAddress || 'No address authenticated' }}
        </div>
        <div spacer style="height: 26px" />
        <div
          class="gray-button-container"
          style="display: flex; align-items: center; cursor: pointer"
          v-on:click="copyAddress"
        >
          <ColorImage
            :src="showingCopyCheckmark ?
              require('../../assets/copy_checkmark.svg') :
              require('../../assets/copy_icon.svg')"
            :color="showingCopyCheckmark ? 'white' : '#95A7AE'"
          />
          <div spacer style="width: 10px" />
          <div style="font-size: 14px; line-height: 140%; color: #95A7AE">
            Copy to clipboard
          </div>
        </div>
        <div class="horizontal-divider" />
        <div class="settings-subheader-text">
          Zkopru Blockchain
        </div>
        <div spacer style="height: 24px" />
        <div style="color: white; font-size: 14px; line-height: 140%">
          Auto Sync is recommended
        </div>
        <div style="color: #95A7AE; font-size: 12px">
          to see the most recent changes.
        </div>
        <div spacer style="height: 24px" />
        <div style="display: flex; align-items: center">
          <Checkbox
            v-model:checked="$store.state.wallet.autosyncEnabled"
            :onChange="() => $store.dispatch('saveState')"
          />
          <div class="settings-check-text">
            Auto Sync
          </div>
        </div>
        <div class="horizontal-divider" />
        <div
          class="gray-button-container"
          v-on:click="showingClearDataPopup = true"
        >
          <img :src="require('../../assets/trash.svg')" />
          <div style="width: 11px" />
          <div>Clear Data</div>
        </div>
        <ClearDataPopup
          :visible="showingClearDataPopup"
          :onCancel="() => showingClearDataPopup = false"
        />
        <div class="horizontal-divider" />
        <div
          class="gray-button-container"
          v-on:click="mintTokens(100000)"
        >
          <img :src="require('../../assets/mint_token.svg')" />
          <div style="width: 11px" />
          <div>Mint Test Token</div>
        </div>
        <div class="horizontal-divider" />
        <div
          class="gray-button-container"
          v-on:click="$store.dispatch('registerAddress')"
        >
          <img :src="require('../../assets/alias_address.svg')" />
          <div style="width: 11px" />
          <div>Alias ENS Address</div>
        </div>
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
import ColorImage from './ColorImage'

@Component({
  name: 'SettingsPanel',
  components: { Checkbox, Button, ClearDataPopup, ColorImage, },
  props: [ 'onClose', 'visible', ],
})
export default class SettingsPanel extends Vue {
  currentbuild = buildnum
  showingClearDataPopup = false
  tokenAddress = ''
  showingCopyCheckmark = ''

  _onClose() {
    if (typeof this.onClose === 'function') {
      this.onClose()
    }
  }

  async registerToken() {
    await this.$store.dispatch('registerERC20', this.tokenAddress)
    this.tokenAddress = ''
  }

  async mintTokens(amount) {
    await this.$store.dispatch('mint', amount)
  }

  copyAddress() {
    const ghostEl = document.createElement('div')
    ghostEl.style.position = 'fixed'
    ghostEl.style.top = '-99999999px'
    ghostEl.style.left = '-99999999px'
    const node = document.createTextNode(this.$store.state.zkopru.zkAddress)
    ghostEl.appendChild(node)
    document.body.appendChild(ghostEl)
    if (document.selection) {
      const range = document.body.createTextRange()
      range.moveToElementText(ghostEl)
      range.select()
    } else if (window.getSelection) {
      window.getSelection().empty()
      const range = document.createRange()
      range.selectNode(ghostEl)
      window.getSelection().addRange(range)
    }
    document.execCommand('copy')
    ghostEl.remove()
    this.showingCopyCheckmark = true
    setTimeout(() => {
      this.showingCopyCheckmark = false
    }, 2500)
  }
}
</script>

<style scoped>
.settings-container {
  width: 289px;
  position: fixed;
  top: 0px;
  right: 0px;
  height: calc(100vh - 32px);
  background-color: #05141A;
  padding: 16px 32px;
  z-index: 10;
  display: flex;
  flex-direction: column;
}
.settings-subheader-text {
  font-size: 12px;
  color: #95A7AE;
  font-weight: bold;
  line-height: 140%;
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
  color: #9EFFEE;
  font-size: 12px;
  max-width: 100%;
  word-break: break-all;
}
.build-number {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  align-self: flex-end;
}
.horizontal-divider {
  height: 1px;
  background-color: #2A3D46;
  margin: 24px 0px;
}
.settings-check-text {
  color: #9EFFEE;
  font-size: 14px;
}
.slide-enter, .slide-leave-to {
  /* width + padding */
  right: -540px;
}
.slide-enter-active, .slide-leave-active {
  transition: right 0.4s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.gray-button-container {
  font-size: 14px;
  line-height: 140%;
  color: #95A7AE;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
</style>
