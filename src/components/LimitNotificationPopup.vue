<template>
  <div class="container">
    <div class="popup">
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div class="title-text">Exceed sendable amount</div>
        <img
          :src="require('../../assets/close_icon.svg')"
          v-on:click="closeClicked"
          style="cursor: pointer; padding: 4px"
        />
      </div>
      <div spacer style="height: 22px" />
      <div class="line-item">
        <div>Send</div>
        <div>{{ transferAmount }} {{ activeToken.toUpperCase() }}</div>
      </div>
      <div class="line-item">
        <div>Sendable Amount</div>
        <div>{{ transferableAmount }} {{ activeToken.toUpperCase() }}</div>
      </div>
      <div class="line-item">
        <div>To</div>
        <div style="max-width: 80%; overflow: auto; word-wrap: break-word">
          {{ zkAddress }}
        </div>
      </div>
      <div class="line-item" style="display: flex; justify-content:left; box-shadow: none;">
        <img :src="require('../../assets/warning.svg')" />
        <div spacer style="width: 13px" />
        <div style="font-size: 16px; color: #f49f2f;">
          Please set amount below {{ transferableAmount }}
          {{ activeToken.toUpperCase() }}
        </div>
      </div>
      <NextButton text="Back" :onNext="() => closeClicked()" />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import Component from "vue-class-component";
import NextButton from "./NextButton";

@Component({
  name: "LimitNotificationPopup",
  components: { NextButton },
  props: [
    "transferAmount",
    "transferableAmount",
    "activeToken",
    "feeAmount",
    "onClose",
    "zkAddress",
    "tx",
  ],
})
export default class LimitNotificationPopup extends Vue {
  closeClicked() {
    if (typeof this.onClose === "function") {
      this.onClose();
    }
  }
}
</script>
<style scoped>
.container {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background: linear-gradient(
    323.78deg,
    rgba(0, 0, 0, 0.8) -10.87%,
    rgba(1, 18, 18, 0.8) 47.21%,
    rgba(0, 0, 0, 0.8) 101.17%,
    rgba(0, 0, 0, 0.8) 101.17%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 117px;
  /* justify-content: center; */
}
.popup {
  border-radius: 8px;
  border: 1px solid #f49f2f;
  background-color: #05141a;
  max-width: 505px;
  width: 100vw;
  padding: 22px;
}
.line-item {
  padding: 16px 4px;
  font-size: 14px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 1px 0px #2a3d46;
  overflow: auto;
}
.title-text {
  color: #f2f2f2;
  font-size: 12px;
  font-weight: 600;
}
.detail-text {
  color: #95a7ae;
  font-size: 11px;
}
</style>
