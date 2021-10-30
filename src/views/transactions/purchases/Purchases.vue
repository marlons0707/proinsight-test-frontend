<template>
  <b-tabs
    v-model="tabIndex"
    content-class="mt-1"
  >
    <!-- This tabs content will always be mounted -->
    <b-tab title="Historial de compras">
      <purchase-list
        :key="purchaseListKey"
        @addPurchaseTab="newTab($event)"
      />
    </b-tab>

    <!-- This tabs content will not be mounted until the tab is shown -->
    <!-- and will be un-mounted when hidden -->
    <b-tab
      title="Nueva compra"
      lazy
    >
      <purchase-add @changeTab="changeTab($event)" />
    </b-tab>

    <!-- Dynamic tab for purchase view -->
    <b-tab
      v-for="purchase in purchasesTabs"
      :key="'purchase-tab-' + purchase"
      :title="'Compra #' + purchase"
      lazy
    >
      <purchase-view :purchase-id="purchase" />
    </b-tab>

    <!-- Close tab button -->
    <template
      v-if="purchasesTabs.length > 0"
      #tabs-end
    >
      <b-nav-item
        @click.prevent="closeTab(purchasesTabs[0])"
      >
        <b>x</b>
      </b-nav-item>
    </template>

  </b-tabs>
</template>

<script>
import PurchaseList from './PurchasesList.vue'
import PurchaseAdd from './PurchasesAdd.vue'
import PurchaseView from './PurchaseView.vue'

export default {
  components: {
    PurchaseList,
    PurchaseAdd,
    PurchaseView,
  },

  data() {
    return {
      tabIndex: 0,
      purchaseListKey: 0,
      purchasesTabs: [],
    }
  },

  methods: {
    changeTab(tabIndex) {
      this.tabIndex = tabIndex // Change tab
      this.purchaseListKey += 1 // Re-Render component
    },

    newTab(purchaseId) {
      this.purchasesTabs = []
      this.purchasesTabs.push(purchaseId)
      setTimeout(() => {
        this.tabIndex = 2
      }, 100)
    },

    closeTab(x) {
      for (let i = 0; i < this.purchasesTabs.length; i += 1) {
        if (this.purchasesTabs[i] === x) {
          this.purchasesTabs.splice(i, 1)
        }
      }
      this.tabIndex = 0 // Redirecto to list
    },
  },
}
</script>
