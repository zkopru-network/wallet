<template>
  <Popup :visible="visible" :onCancel="cancel">
    <div class="popup-title">
      Warning!
    </div>
    <div spacer style="height: 16px" />
    <div class="popup-body">
      This will clear all data and require a complete resynchronization. Do this if your wallet is failing to sync or you need to update.
    </div>
    <div spacer style="height: 16px" />
    <div style="display: flex; justify-content: space-around; align-self: center">
      <Button :onClick="clear">
        Clear Data
      </Button>
      <div spacer style="width: 24px" />
      <Button :onClick="cancel">
        Cancel
      </Button>
    </div>
  </Popup>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Popup from './Popup'
import Button from './Button'

@Component({
  name: 'ClearDataPopup',
  components: { Popup, Button, },
  props: [ 'visible', 'onComplete', 'onCancel' ],
})
export default class ClearDataPopup extends Vue {
  cancel() {
    if (typeof this.onCancel === 'function') {
      this.onCancel()
    }
  }

  async clear() {
    await this.$store.dispatch('resetDB')
  }
}
</script>

<style scoped>
</style>
