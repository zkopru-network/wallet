<template>
  <CenteredLeftMenu>
    <div spacer style="height: 70px" />
    <div class="section-container">
      <div class="title-text" style="display: flex; align-items: center">
        <div style="display: flex">
          <div>Send</div>
          <div spacer style="width: 10px" />
          <img height="13px" :src="tryLoadAssetIcon(activeAsset)" />
        </div>
        <div spacer style="flex: 1" />
        <InfoText :text="tooltips.SEND_ASSET" />
      </div>
      <div spacer style="height: 23px" />
      <AssetDropdown
        :activeAsset="activeAsset"
        v-model="activeAsset"
        :showIcon="false"
      />
      <div spacer v-if="!!activeAsset" style="height: 16px" />
      <AssetAmountField
        v-if="!!activeAsset"
        :asset="activeAsset"
        v-model="transferAmount"
        :assetAmountState="amountState"
        :buttons="['Max']"
        :buttonClicked="maxAmount.bind(this)"
      />
    </div>
    <div class="section-container">
      <div class="title-text">
        <div style="display: flex; align-items: center">
          <div>To</div>
          <div spacer style="flex: 1" />
          <InfoText :text="tooltips.SEND_TO" />
        </div>
      </div>
      <div spacer style="height: 23px" />
      <AddressField v-model="zkAddress" :address="zkAddress" />
    </div>
    <div class="section-container" style="margin-bottom: 0px">
      <div
        style="display: flex; flex-direction: column; justify-content: center"
      >
        <div class="title-text">
          <div style="display: flex; align-items: center">
            <div>Fee in GWEI</div>
            <div spacer style="flex: 1" />
            <InfoText :text="tooltips.SEND_FEE" />
          </div>
        </div>
        <div spacer style="height: 23px" />
        <AssetAmountField
          v-model="fee"
          :assetAmountState="feeState"
          :buttons="['Fast', 'Standard']"
          :buttonClicked="suggestedFee.bind(this)"
        />
      </div>
    </div>
    <NextButton
      :disabled="fee == '' || amountState != 1"
      :onNext="() => (showingTransferConfirm = true)"
    />
    <ConfirmTransferPopup
      v-if="showingTransferConfirm"
      :transferAmount="transferAmount"
      :feeAmount="totalFee"
      :activeToken="activeAsset"
      :zkAddress="zkAddress"
      :tx="tx"
      :onClose="() => (showingTransferConfirm = false)"
    />
  </CenteredLeftMenu>
</template>
<script>
import Vue from "vue";
import Component from "vue-class-component";
import Header from "./components/Header";
import AssetDropdown from "./components/AssetDropdown";
import Button from "./components/Button";
import AddressField from "./components/AddressField";
import FeeField from "./components/FeeField";
import AssetAmountField from "./components/AssetAmountField";
import { toWei, fromWei } from "./utils/wei";
import BN from "bn.js";
import CenteredLeftMenu from "./components/CenteredLeftMenu";
import NextButton from "./components/NextButton";
import ConfirmTransferPopup from "./components/ConfirmTransferPopup";
import tooltips from "./tooltips";
import InfoText from "./components/InfoText";
import decimalCount from "./utils/decimal-count";

@Component({
  name: "Transfer",
  components: {
    Header,
    AssetDropdown,
    Button,
    AddressField,
    FeeField,
    AssetAmountField,
    CenteredLeftMenu,
    NextButton,
    ConfirmTransferPopup,
    InfoText,
  },
  watch: {
    transferAmount() {
      this.generateTx();
      this.updateAmountStates();
      this.effectiveAmount();
    },
    zkAddress() {
      this.generateTx();
    },
    fee() {
      this.generateTx();
      this.updateAmountStates();
      this.effectiveAmount();
    },
    etherAmount() {
      this.updateAmountStates();
      this.effectiveAmount();
    },
    activeAsset(newVal, oldVal) {
      if (newVal === oldVal) return;
      this.transferAmount = "";
    },
  },
})
export default class Transfer extends Vue {
  tooltips = tooltips;
  activeAsset = "";
  transferAmount = "0";
  transferableAmount = 0;
  amountState = 0;
  zkAddress = "";
  fee = "";
  feeState = 0;
  totalFee = "-";
  tx = undefined;
  showingTransferConfirm = false;
  activeFeePromise = undefined;

  mounted() {
    if (this.$route.query.asset) {
      this.activeAsset = this.$route.query.asset.toUpperCase();
    }
  }

  paramString() {
    return `${this.zkAddress}-${this.fee}-${this.transferAmount}`;
  }

  async maxAmount() {
    if (this.activeAsset === "ETH") {
      const fee = isNaN(this.totalFee) ? 0 : +this.totalFee;
      this.transferAmount = +this.$store.state.zkopru.balance - fee;
    } else {
      const balance = this.$store.state.zkopru.tokenBalances[this.activeAsset];
      this.transferAmount = balance;
    }
  }

  async suggestedFee(clickedButton) {
    let feePromise;
    try {
      this.feeState = 3;
      feePromise = this.$store.dispatch("loadCurrentWeiPerByte");
      this.activeFeePromise = feePromise;
      const weiPerByte = await feePromise;
      if (this.activeFeePromise !== feePromise) return;
      this.activeFeePromise = undefined;
      this.fee = Math.floor(
        ((clickedButton === "Standard" ? 5 : 15) * +weiPerByte) / 10 ** 9
      );
    } catch (err) {
      if (this.activeFeePromise === feePromise)
        this.activeFeePromise = undefined;
      this.feeState = 2;
    }
  }

  async generateTx() {
    if (!this.zkAddress || !this.fee || !this.transferAmount || !this.transferableAmount) {
      this.totalFee = "-";
      this.tx = undefined;
      return;
    }
    try {
      if (this.activeAsset === "ETH") {
        const tx = await this.$store.state.zkopru.wallet.generateEtherTransfer(
          this.zkAddress,
          toWei(this.transferAmount),
          (+this.fee * 10 ** 9).toString()
        );
        this.totalFee = fromWei(tx.fee.toString(), 8);
        this.totalEther = fromWei(
          new BN(tx.fee).add(new BN(toWei(this.transferAmount))).toString()
        );
        this.tx = tx;
      } else {
        const { address, decimals } =
          this.$store.state.zkopru.registeredTokens.find(({ symbol }) => {
            return symbol === this.activeAsset;
          });
        const decimalAmount = `${+this.transferAmount * 10 ** +decimals}`;
        const tx = await this.$store.state.zkopru.wallet.generateTokenTransfer(
          this.zkAddress,
          decimalAmount,
          address,
          (+this.fee * 10 ** 9).toString()
        );
        this.totalFee = fromWei(tx.fee.toString(), 8);
        this.totalEther = fromWei(new BN(tx.fee)).toString();
        this.tx = tx;
      }
    } catch (err) {
      if (err.toString().indexOf("Not enough Ether") !== -1) {
        this.totalFee = Infinity;
        this.totalEther = Infinity;
        this.feeState = 2;
        if (this.activeAsset === "ETH") {
          this.amountState = 2;
        }
      }
    }
  }

  async sendTx() {
    if (!this.tx) return;
    await this.$store.state.zkopru.wallet.wallet.sendTx({
      tx: this.tx,
    });
    await this.$store.dispatch("loadL2Balance");
    this.$router.push({ path: "/wallet" });
  }

  tryLoadAssetIcon(symbol) {
    try {
      return require(`../assets/token_icons/${symbol.toUpperCase()}.svg`);
    } catch (_) {
      return require("../assets/token_no_icon.png");
    }
  }

  effectiveAmount() {
    // maximum 4 utxo can be selected
    // at least one note is Eth
    let noteLimit = 3;
    if (this.activeAsset.toUpperCase() != "ETH") noteLimit += 1; 

    const notes = this.$store.state.noteInfo[this.activeAsset];
    const { count, largestNotes } = notes;

    if (count <= noteLimit) {
      this.transferableAmount = this.transferAmount
    } else {
      for (let i = 0; i < noteLimit; i++) {
        this.transferableAmount += largestNotes[i];
      }
    }
  }

  updateAmountStates() {
    let decimals;
    const token = this.$store.state.zkopru.registeredTokens.find(
      ({ symbol }) => {
        return symbol === this.activeAsset;
      }
    );
    if (this.activeAsset.toUpperCase() === "ETH") {
      decimals = 18;
    } else if (token) {
      decimals = token.decimals;
    } else {
      decimals = 0;
    }
    if (this.transferAmount === "") {
      this.amountState = 0;
    } else if (isNaN(this.transferAmount)) {
      this.amountState = 2;
    } else if (
      this.activeAsset === "ETH" &&
      +this.transferAmount <= +this.$store.state.zkopru.balance &&
      decimalCount(this.transferAmount) <= decimals
    ) {
      this.amountState = 1;
    } else if (
      +this.transferAmount <=
        +this.$store.state.zkopru.tokenBalances[this.activeAsset] &&
      decimalCount(this.transferAmount) <= decimals
    ) {
      this.amountState = 1;
    } else if (
      +this.transferAmount > this.transferableAmount &&
      decimalCount(this.transferAmount) <= decimals
    ) {
      this.amountState = 4;
    } else {
      this.amountState = 2;
    }
    if (!this.fee) {
      this.feeState = 0;
    } else if (isNaN(this.fee) || +this.fee <= 0) {
      this.feeState = 2;
    } else {
      this.feeState = 1;
    }
    if (isNaN(this.totalEther)) return;
    if (+this.totalEther > +this.$store.state.zkopru.balance) {
      if (this.activeAsset === "ETH") {
        this.amountState = 2;
      }
      this.feeState = 2;
    }
  }
}
</script>
<style scoped>
.small-text {
  font-size: 12px;
}
.section-container {
  display: flex;
  flex-direction: column;
  max-width: 452px;
  width: 100vw;
  background-color: #081b24;
  border: 1px solid #2a3d46;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 16px;
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
