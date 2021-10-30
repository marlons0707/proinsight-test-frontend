<template>
  <section class="invoice-add-wrapper">

    <validation-observer ref="simpleRules">
      <b-form
        v-if="show"
        @submit.prevent="onSubmit"
      >
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
                    <validation-provider
                      #default="{ errors }"
                      name="proveedor"
                      rules="required"
                    >
                      <b-form-group>
                        <v-select
                          v-if="suppliersOptions"
                          :options="suppliersOptions"
                          input-id="select-suppliers"
                          :reduce="supplier => supplier"
                          :clearable="true"
                          placeholder="Selecciona el proveedor"
                          required
                          @search="onSearchSuppliers"
                          @input="val => setSupplierData(val)"
                        >
                          <template #list-header>
                            <li
                              class="add-new-supplier-header d-flex align-items-center my-50"
                              @click="supplierAddSidebarActive = true"
                            >
                              <feather-icon
                                icon="PlusIcon"
                                size="16"
                              />
                              <span class="align-middle ml-25">Nuevo proveedor</span>
                            </li>
                          </template>
                          <template slot="no-options">
                            Lo siento, no se encontraron proveedores
                          </template>
                        </v-select>
                        <small class="text-danger">{{ errors[0] }}</small>
                      </b-form-group>
                    </validation-provider>
                  </b-col>

                  <!-- Col: Fecha -->
                  <b-col
                    cols="12"
                    xl="4"
                    md="6"
                  >
                    <validation-provider
                      #default="{ errors }"
                      name="fecha"
                      rules="required"
                    >
                      <b-form-group>
                        <h6 class="mb-1 mt-1">
                          Fecha:
                        </h6>
                        <flat-pickr
                          v-model="purchaseData.purchase_date"
                          class="form-control invoice-edit-input"
                          placeholder="Fecha de la compra"
                        />
                        <small class="text-danger">{{ errors[0] }}</small>
                      </b-form-group>
                    </validation-provider>
                  </b-col>

                  <!-- Col: # Compra -->
                  <b-col
                    cols="12"
                    xl="4"
                    md="6"
                  >
                    <b-form-group>
                      <h6 class="mb-1 mt-1">
                        Doc. Externo:
                      </h6>
                      <b-input-group>
                        <b-form-input
                          id="purchase-data-id"
                          v-model="purchaseData.document"
                          placeholder="Documento externo (opcional)"
                        />
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-card-body>

              <b-card-body class="invoice-padding form-item-section">
                <div
                  ref="form"
                  class="repeater-form"
                  :style="{height: trHeight}"
                >
                  <b-row
                    v-for="(product, index) in purchaseData.products"
                    :key="index"
                    ref="row"
                    class="pb-2"
                  >
                    <!-- Item Form -->
                    <!-- ? This will be in loop => So consider below markup for single item -->
                    <b-col cols="12">
                      <!-- ? Flex to keep separate width for XIcon and SettingsIcon -->
                      <div class="d-none d-lg-flex">
                        <b-row class="flex-grow-1 px-1">
                          <!-- Single Item Form Headers -->
                          <b-col
                            cols="12"
                            lg="5"
                          >
                            Producto
                          </b-col>
                          <b-col
                            cols="12"
                            lg="3"
                          >
                            Costo
                          </b-col>
                          <b-col
                            cols="12"
                            lg="2"
                          >
                            Cantidad
                          </b-col>
                          <b-col
                            cols="12"
                            lg="2"
                          >
                            Precio
                          </b-col>
                        </b-row>
                        <div class="form-item-action-col" />
                      </div>

                      <!-- Form Input Fields OR content inside bordered area  -->
                      <!-- ? Flex to keep separate width for XIcon and SettingsIcon -->
                      <div class="d-flex border rounded">
                        <b-row class="flex-grow-1 p-2">
                          <!-- Single Item Form Headers -->
                          <b-col
                            cols="12"
                            lg="5"
                          >
                            <label class="d-inline d-lg-none">Producto</label>
                            <v-select
                              :options="productsOptions"
                              :reduce="product => product"
                              input-id="select-products"
                              :clearable="false"
                              class="mb-2 item-selector-title"
                              placeholder="Seleccione producto"
                              @search="onSearchProducts"
                              @input="val => updateItem(index, val)"
                            >
                              <template slot="no-options">
                                Lo siento, no se encontraron productos
                              </template>
                            </v-select>
                          </b-col>
                          <b-col
                            cols="12"
                            lg="3"
                          >
                            <label class="d-inline d-lg-none">Cost</label>
                            <b-form-input
                              v-model="product.cost"
                              type="number"
                              min="0.01"
                              step="any"
                              class="mb-2"
                            />
                          </b-col>
                          <b-col
                            cols="12"
                            lg="2"
                          >
                            <label class="d-inline d-lg-none">Qty</label>
                            <b-form-input
                              v-model="product.quantity"
                              type="number"
                              min="1"
                              step="any"
                              class="mb-2"
                            />
                          </b-col>
                          <b-col
                            cols="12"
                            lg="2"
                          >
                            <label class="d-inline d-lg-none">Price</label>
                            <p class="mb-1">
                              Q.{{ product.cost * product.quantity }}
                            </p>
                          </b-col>

                        </b-row>
                        <div class="d-flex flex-column justify-content-between border-left py-50 px-25">
                          <feather-icon
                            size="16"
                            icon="XIcon"
                            class="cursor-pointer"
                            @click="removeItem(index)"
                          />
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </div>
                <b-button
                  v-ripple.400="'rgba(255, 159, 67, 0.15)'"
                  variant="outline-warning"
                  size="sm"
                  @click="addItem"
                >
                  Agregar producto
                </b-button>
              </b-card-body>

              <!-- Invoice Description: Total -->
              <b-card-body class="invoice-padding pb-0">
                <b-row>
                  <!-- Col: Contact Person -->
                  <b-col
                    cols="12"
                    xl="4"
                    md="6"
                  >
                    <h6 class="mb-1 mt-1">
                      Contacto:
                    </h6>
                    <validation-provider
                      #default="{ errors }"
                      name="contacto"
                      rules="required"
                    >
                      <b-form-group>
                        <b-form-input
                          id="invoice-data-sales-person"
                          v-model="purchaseData.contact"
                          placeholder="Nombre del vendedor"
                        />
                        <small class="text-danger">{{ errors[0] }}</small>
                      </b-form-group>
                    </validation-provider>
                  </b-col>

                  <!-- Col: Total -->
                  <b-col
                    cols="12"
                    md="8"
                    class="mt-md-6 d-flex justify-content-end"
                    order="1"
                    order-md="2"
                  >
                    <div class="purchase-total-wrapper">
                      <div class="purchase-total-item">
                        <p class="purchase-total-title">
                          Total:
                        </p>
                        <p class="purchase-total-amount">
                          Q.{{ purchaseTotal }}
                        </p>
                      </div>
                    </div>
                  </b-col>
                </b-row>
              </b-card-body>

              <!-- Spacer -->
              <hr class="invoice-spacing">

              <!-- Note -->
              <b-card-body class="invoice-padding pt-0">
                <span class="font-weight-bold">Observaciones: </span>
                <b-form-textarea
                  v-model="purchaseData.comments"
                  placeholder="Comentarios y anotaciones relacionadas con la compra"
                />
              </b-card-body>

              <!-- Supplier form -->
              <suppliers-add
                :supplier-add-sidebar-active.sync="supplierAddSidebarActive"
                @refreshData="getSuppliers"
              />

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
                variant="outline-warning"
                block
                type="submit"
              >
                Guardar
              </b-button>
            </b-card>
          </b-col>

        </b-row>

      </b-form>
    </validation-observer>

  </section>
</template>

<script>
import axios from '@axios'
import { heightTransition } from '@core/mixins/ui/transition'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import Ripple from 'vue-ripple-directive'
import SuppliersAdd from '../../contacts/suppliers/SuppliersAdd.vue'

export default {
  components: {
    vSelect,
    SuppliersAdd,
    flatPickr,
    ValidationProvider,
    ValidationObserver,
  },
  directives: {
    Ripple,
  },
  mixins: [heightTransition],

  data() {
    return {
      // Purchase
      purchaseData: {
        supplier_id: '',
        document: '',
        contact: '',
        purchase_date: '',
        comments: '',
        products: [JSON.parse(JSON.stringify(
          { // Detail template
            product_id: null,
            cost: 0,
            quantity: 0,
          },
        ))],
      },

      // Detail template
      formProductBlank: {
        product_id: null,
        cost: 0,
        quantity: 0,
      },

      // Suppliers
      suppliersOptions: [],
      supplierAddSidebarActive: false,

      // Products
      productsOptions: [],
      show: true,
    }
  },

  computed: {
    purchaseTotal() {
      let total = 0
      this.purchaseData.products.forEach(element => {
        total += element.cost * element.quantity
      })
      return total
    },
  },

  mounted() {
    this.initTrHeight()
  },

  created() {
    this.getSuppliers()
    this.getProducts()
    window.addEventListener('resize', this.initTrHeight)
  },

  destroyed() {
    window.removeEventListener('resize', this.initTrHeight)
  },

  methods: {
    getSuppliers() {
      this.suppliersOptions = []
      axios
        .get('supplier?perPage=10&sortField=id&sortDesc=desc&filterField=status&filterValue=Y')
        .then(response => {
          response.data.data.forEach(element => {
            this.suppliersOptions.push({
              label: element.name,
              id: element.id,
            })
          })
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    onSearchSuppliers(search, loading) {
      this.suppliersOptions = []
      if (search.length) {
        loading(true)
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          axios
            .get(`supplier?filterField=status&filterValue=Y&query=${search}`)
            .then(response => {
              loading(false)
              this.suppliersOptions = []
              response.data.data.forEach(element => {
                this.suppliersOptions.push({
                  label: element.name,
                  id: element.id,
                })
              })
            })
            .catch(error => {
              this.showErrors(error)
            })
        }, 300)
      } else {
        this.getSuppliers()
      }
    },

    setSupplierData(supplier) {
      if (supplier) {
        // get Supplier
        axios
          .get(`supplier/${supplier.id}`)
          .then(response => {
            this.purchaseData.contact = response.data.data.contact_name
            this.purchaseData.supplier_id = response.data.data.id
          })
          .catch(error => {
            this.showErrors(error)
          })
      }
    },

    getProducts() {
      this.productsOptions = []
      axios
        .get('product?perPage=10&sortField=id&sortDesc=desc&filterField=status&filterValue=Y')
        .then(response => {
          response.data.data.forEach(element => {
            this.productsOptions.push({
              label: element.name,
              id: element.id,
              cost: element.cost,
              description: element.description,
            })
          })
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    onSearchProducts(search, loading) {
      this.productsOptions = []
      if (search.length) {
        loading(true)
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          axios
            .get(`product?filterField=status&filterValue=Y&query=${search}`)
            .then(response => {
              loading(false)
              this.productsOptions = []
              response.data.data.forEach(element => {
                this.productsOptions.push({
                  label: element.name,
                  id: element.id,
                  cost: element.cost,
                  description: element.description,
                })
              })
            })
            .catch(error => {
              this.showErrors(error)
            })
        }, 300)
      } else {
        this.getProducts()
      }
    },

    onSubmit(event) {
      event.preventDefault()
      this.saveData()
    },

    saveData() {
      axios
        .post('purchase', this.purchaseData)
        .then(async response => {
          if (response.data.res) {
            this.clearForm()
            this.makeToast('success', 'Nuevo ingreso', `Se ha realizado el ingreso correctamente, transacción: #${response.data.data.id}.`)
            await new Promise(resolve => { window.setTimeout(resolve, 1500) })
            this.$emit('changeTab', 0)
          } else {
            throw (response)
          }
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    clearForm() {
      // Reset our form values
      this.purchaseData.supplier_id = ''
      this.purchaseData.purchase_date = ''
      this.purchaseData.document = ''
      this.purchaseData.contact = ''
      this.purchaseData.comments = ''
      this.purchaseData.products = []

      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },

    // Métodos para manejar productos dinamicamente
    // =======================================================
    addItem() {
      this.$refs.form.style.overflow = 'hidden'
      this.purchaseData.products.push(JSON.parse(JSON.stringify(this.formProductBlank)))

      this.$nextTick(() => {
        this.trAddHeight(this.$refs.row[0].offsetHeight)
        setTimeout(() => {
          this.$refs.form.style.overflow = null
        }, 350)
      })
    },

    removeItem(index) {
      this.purchaseData.products.splice(index, 1)
      this.trTrimHeight(this.$refs.row[0].offsetHeight)
    },

    updateItem(index, val) {
      const foundItem = this.purchaseData.products.find(element => element.product_id === val.id)
      if (foundItem) {
        this.makeToast('danger', 'Producto ya seleccionado', `El producto ${val.label} ya fue seleccionado anteriormente, edite la cantidad si es necesario.`)
        this.removeItem(index)
      } else {
        const { id, cost, description } = val
        this.purchaseData.products[index].product_id = id
        this.purchaseData.products[index].cost = cost
        this.purchaseData.products[index].quantity = 1
        this.purchaseData.products[index].description = description
      }
    },

    initTrHeight() {
      this.trSetHeight(null)
      this.$nextTick(() => {
        this.trSetHeight(this.$refs.form.scrollHeight)
      })
    },
    // =======================================================
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
.purchase-add-wrapper {
  .add-new-supplier-header {
    padding: $options-padding-y $options-padding-x;
    color: $success;

    &:hover {
      background-color: rgba($success, 0.12);
    }
  }
}

.purchase-total-wrapper {
  width: 100%;
  max-width: 10rem;
  .purchase-total-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .purchase-total-title {
      margin-bottom: 0.35rem;
    }
    .purchase-total-amount {
      margin-bottom: 0.35rem;
      font-weight: 600;
    }
  }
}
</style>

<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-invoice.scss";
@import '~@core/scss/base/components/variables-dark';

.form-item-section {
background-color: $product-details-bg;
}

.form-item-action-col {
  width: 27px;
}

.repeater-form {
  transition: .35s height;
}

.v-select {
  &.item-selector-title,
  &.payment-selector {
    background-color: #fff;

    .dark-layout & {
      background-color: unset;
    }
  }
}

.dark-layout {
  .form-item-section {
    background-color: $theme-dark-body-bg;

    .row .border {
      background-color: $theme-dark-card-bg;
    }

  }
}
</style>
