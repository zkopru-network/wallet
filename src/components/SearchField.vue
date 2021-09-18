<template>
  <div style="position: relative">
    <input
      class="search-field"
      :placeholder="placeholder || 'search'"
      v-on:input="textChanged"
      :value="text"
    />
    <ColorImage
      style="position: absolute; left: 6px; top: 3px"
      color="#95A7AE"
      :src="require('../../assets/search_icon.svg')"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import Component from 'vue-class-component'
import ColorImage from './ColorImage'

@Component({
  name: 'SearchField',
  components: { ColorImage, },
  props: ['text', 'placeholder'],
  model: {
    prop: 'text',
    event: 'textChanged',
  },
})
export default class SearchField extends Vue {
  textChanged(e) {
    this.$emit('textChanged', e.target.value)
  }
}
</script>

<style scoped>
.search-field {
  height: 24px;
  width: 392px;
  border: 1px solid #2A3D46;
  border-radius: 20px;
  background: #081B24;
  color: white;
  padding: 2px 10px;
  padding-left: 30px;
}
.search-field:placeholder {
  font-size: 14px;
  color: #4C5F67;
}
.search-field:focus {
  outline: 0px;
}
</style>
