<template>
  <Popup :visible="visible" :onCancel="onCancel">
    <div class="popup-title">
      Sync with Zkopru.
    </div>
    <div spacer style="height: 32px" />
    <div class="popup-body">
      In order to use your wallet you will need to download the Zkopru blockchain to your browser so that your browser can verify each block.
    </div>
    <div spacer style="height: 74px" />
    <Button :onClick="startSync">
      Yes, sync now.
    </Button>
    <div spacer style="height: 64px" />
    <Checkbox
      style="align-self: center"
      text="Allow future syncs to happen automatically."
      v-model:checked="$store.state.wallet.autosyncEnabled"
      :onChange="() => $store.dispatch('saveState')"
    />
    <div spacer style="height: 16px" />
    <div class="popup-footer">
      Change your preferences at any time in settings.
    </div>
  </Popup>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Popup from './Popup'
import Button from './Button'
import Checkbox from './Checkbox'

@Component({
  name: 'StartSyncPopup',
  components: { Popup, Button, Checkbox, },
  props: [ 'visible', 'onCancel', 'startSync', ],
})
export default class StartSyncPopup extends Vue {}
</script>

<style scoped>
</style>
