<template>
  <CenteredLeftMenu>
    <div spacer style="height: 70px" />
    <div class="section-container">
      <div class="title-text">
        Your Public Wallet Address
      </div>
      <div spacer style="height: 23px" />
      <div class="readonly-address-field">
        <div>{{ $store.state.zkopru.zkAddress || 'Loading...' }}</div>
        <div style="cursor: pointer" v-on:click="copyAddress">
          <img
            :src="showingCopyCheckmark ?
                  require('../assets/copy_checkmark.svg') :
                  require('../assets/copy_icon.svg')"
          />
        </div>
      </div>
      <div spacer style="height: 24px" />
      <div style="font-size: 14px; color: #95A7AE">
        When receiving funds from another party, they will need to paste your public address in the send field.
      </div>
      <div class="share-button">
        <img :src="require('../assets/twitter_logo.svg')" style="margin-right: 10px" /> Share
      </div>
    </div>
  </CenteredLeftMenu>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import CenteredLeftMenu from './components/CenteredLeftMenu'
import NextButton from './components/NextButton'

@Component({
  name: 'Receive',
  components: { CenteredLeftMenu, NextButton, },
})
export default class Receive extends Vue {
  showingCopyCheckmark = false

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
.section-container {
  display: flex;
  flex-direction: column;
  max-width: 452px;
  width: 100vw;
  background-color: #081B24;
  border: 1px solid #2A3D46;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 16px;
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
.readonly-address-field {
  color: white;
  background: #081B24;
  border: 1px solid #5d7078;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  word-wrap: break-word;
  word-break: break-word;
}
.share-button {
  border-radius: 20px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 27px;
  cursor: pointer;
  user-select: none;
  color: #A2EFE1;
  border: 1px solid #A2EFE1;
}
</style>
