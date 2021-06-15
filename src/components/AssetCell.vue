<template>
  <div class="cell-container">
    <div style="display: flex; justify-content: flex-end">
      <div style="cursor: pointer">
        <img :src="require('../../assets/top_up.svg')" />
      </div>
    </div>
    <div style="display: flex; align-items: center; justify-content: center;">
      <img
        :src="require(`../../assets/token_icons/${(symbol || 'eth').toUpperCase()}.svg`)"
        width="93px"
        height="93px"
        style="background-color: white; border-radius: 50%; object-fit: contain; border: 1px solid black"
      />
    </div>
    <div spacer style="height: 23px" />
    <div style="display: flex; justify-content: space-between" class="cell-text">
      <div>
        1
      </div>
      <div>
        {{ symbol || 'ETH' }}
      </div>
    </div>
    <div style="align-self: center; color: rgba(150, 150, 150, 0.65)" class="cell-text">
      ---------------------
    </div>
    <div style="display: flex; justify-content: space-between" class="cell-text">
      <div>
        1
      </div>
      <div>
        USD
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import Button from './Button'
@Component({
  name: 'AssetCell',
  props: ['symbol'],
  components: { Button, },
})
export default class AssetCell extends Vue {}
</script>
<style scoped>
.cell-container {
  user-select: none;
  background: #0e2936;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 288px;
  height: 288px;
  padding: 10px;
  margin: 13px;
}
.cell-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
}
</style>
