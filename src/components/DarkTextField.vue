<template>
  <div>
    <input
      class="dark-input"
      type="text"
      :value="text"
      v-on:input="$emit('textChanged', $event.target.value)"
      :placeholder="placeholder"
    />
    <div class="dark-underline" style="background: #95A7AE" />
    <!-- <div v-if="amountState === 0" class="fee-underline" style="background: #95A7AE" />
    <div v-if="amountState === 1" class="fee-underline" style="background: green" />
    <div v-if="amountState === 2" class="fee-underline" style="background: red" /> -->
  </div>
</template>
<script>
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'DarkTextField',
  props: [
    'text',
    'placeholder',
  ],
  computed: {
  },
  model: {
    prop: 'text',
    event: 'textChanged',
  }
})
export default class DarkTextField extends Vue {
}
</script>
<style scoped>
.dark-underline {
  height: 1px;
  width: 100%;
}
.dark-input {
  border: 0px;
  background: transparent;
  color: white;
  width: 100%;
  font-family: Inter;
  font-size: 12px;
}
.dark-input:placeholder {
  font-size: 9px;
}
.dark-input:focus {
  border: 0px;
  outline: 0px;
}
</style>
