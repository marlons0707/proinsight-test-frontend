<template>
  <section class="invoice-add-wrapper">
    <b-row class="invoice-add">

      <!-- Col: Left (Invoice Container) -->
      <b-col
        cols="12"
        xl="9"
        md="8"
      >
        <b-card
          class="purchase-add-wrapper"
          no-body
        >
          <b-card-body>
            <b-row>
              <!-- Col: Proveedor -->
              <b-col
                cols="12"
                xl="4"
                md="6"
              >
                <h6 class="mb-1 mt-1">
                  Proveedor:
                </h6>
                {{ purchaseData.supplier }}
              </b-col>

              <!-- Col: Fecha -->
              <b-col
                cols="12"
                xl="4"
                md="6"
              >
                <h6 class="mb-1 mt-1">
                  Fecha de compra:
                </h6>
                {{ purchaseData.purchase_date }}
              </b-col>

              <!-- Col: # Doc. Externo -->
              <b-col
                cols="12"
                xl="4"
                md="6"
              >
                <h6 class="mb-1 mt-1">
                  Doc. Externo:
                </h6>
                {{ purchaseData.document }}
              </b-col>
            </b-row>
          </b-card-body>

          <b-card-body class="invoice-padding form-item-section">
            <b-table
              responsive="sm"
              :items="purchaseData.products"
              :fields="Purchasefields"
            />

            <div
              v-if="purchaseData.summaryInfo[0]"
              class="float-right mr-4"
            >
              Total:
              <h4 class="purchase-total-amount">
                Q.{{ purchaseData.summaryInfo[0].total }}
              </h4>
            </div>
          </b-card-body>

          <b-card-body>
            <b-row>
              <!-- Col: Contact Person -->
              <b-col
                cols="12"
                xl="4"
                md="4"
              >
                <h6 class="mb-1">
                  Contacto:
                </h6>
                {{ purchaseData.contact }}
              </b-col>
              <b-col
                cols="12"
                xl="4"
                md="4"
              >
                <h6 class="mb-1">
                  Ingresada al sistema:
                </h6>
                {{ purchaseData.created_at }}
              </b-col>
              <b-col
                cols="12"
                xl="4"
                md="4"
              >
                <h6 class="mb-1">
                  Ingresado por:
                </h6>
                {{ purchaseData.user }}
              </b-col>
            </b-row>
          </b-card-body>

          <!-- Spacer -->
          <hr class="invoice-spacing">

          <!-- Note -->
          <b-card-body class="invoice-padding pt-0">
            <span class="font-weight-bold">Observaciones: </span>
            {{ purchaseData.comments }}
          </b-card-body>

        </b-card>
      </b-col>

      <!-- Right Col: Card -->
      <b-col
        cols="12"
        md="4"
        xl="3"
        class="invoice-actions mt-md-0 mt-2"
      >
        <!-- Action Buttons -->
        <b-card>
          <!-- Button: Print -->
          <b-button
            v-ripple.400="'rgba(255, 159, 67, 0.15)'"
            variant="outline-danger"
            block
            @click="purchaseCancel"
          >
            Anular
          </b-button>
        </b-card>
      </b-col>

    </b-row>
  </section>
</template>

<script>
import axios from '@axios'
import Ripple from 'vue-ripple-directive'

export default {

  directives: {
    Ripple,
  },

  props: {
    purchaseId: {
      type: Number,
      default: () => 0,
    },
  },

  data() {
    return {
      purchaseData: {
        supplier_id: '',
        document: '',
        contact: '',
        purchase_date: '',
        comments: '',
        products: [],
        summaryInfo: [],
        created_at: '',
        user: '',
      },

      Purchasefields: [
        { key: 'product', label: 'Producto' },
        { key: 'qty', label: 'Cantidad' },
        { key: 'cost', label: 'Costo' },
        { key: 'total', variant: 'success' }],
    }
  },

  mounted() {
    if (this.purchaseId > 0) {
      this.getPurchase()
    }
  },

  methods: {
    getPurchase() {
      axios
        .get(`purchase/${this.purchaseId}`)
        .then(response => {
          this.purchaseData.supplier = response.data.data.supplier
          this.purchaseData.supplier_id = response.data.data.supplier_id
          this.purchaseData.purchase_date = response.data.data.purchase_date
          this.purchaseData.document = (response.data.data.document) ? response.data.data.document : '-'
          this.purchaseData.contact = (response.data.data.contact) ? response.data.data.contact : '-'
          this.purchaseData.comments = (response.data.data.comments) ? response.data.data.comments : '-'
          this.purchaseData.products = response.data.data.products
          this.purchaseData.summaryInfo = response.data.data.summaryInfo
          this.purchaseData.created_at = response.data.data.created_at
          this.purchaseData.user = response.data.data.user
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    purchaseCancel() {
      console.log('cancel')
      //
    },
  },
}
</script>
