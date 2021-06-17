<template>
  <Popup :visible="visible" :onCancel="onCancel">
    <div class="small-white-text">
      Your public wallet address
    </div>
    <div spacer style="height: 18px" />
    <div class="readonly-address-field">
      <div>{{ $store.state.zkopru.shortZkAddress || '...' }}</div>
      <div style="cursor: pointer" v-on:click="copyAddress">
        <img :src="require('../../assets/copy_icon.svg')" />
      </div>
    </div>
    <div spacer style="height: 18px" />
    <div class="small-white-text">
      When receiving funds from another party they will need your public address.
    </div>
    <div spacer style="height: 40px" />
    <Button buttonStyle="background: #fff; color: black; padding: 12px 64px">
      Share on Twitter
    </Button>
    <div spacer style="height: 52px" />
    <div class="underline-button" v-on:click="cancel">
      Close
    </div>
  </Popup>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Popup from './Popup'
import Button from './Button'

@Component({
  name: 'AddressPopup',
  components: { Popup, Button, },
  props: ['visible', 'onCancel', ],
})
export default class AddressPopup extends Vue {
  cancel() {
    if (typeof this.onCancel === 'function') {
      this.onCancel()
    }
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
  }
}
</script>
<style scoped>
.small-white-text {
  color: #95a7ae;
  font-size: 18px;
  max-width: 446px;
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
}
.underline-button {
  color: #95a7ae;
  font-size: 18px;
  text-decoration: underline;
  align-self: center;
  cursor: pointer;
  user-select: none;
}
</style>
