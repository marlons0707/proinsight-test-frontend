<template>
  <div>
    <b-sidebar
      id="sidebar-backdrop"
      backdrop
      shadow
      bg-variant="white"
      sidebar-class="sidebar-lg"
      no-header
      right
      :visible="priceAddSidebarActive"
      @change="(val) => $emit('update:price-add-sidebar-active', val)"
    >

      <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Nuevo precio
          </h5>
          <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="hide"
          />
        </div>

        <!-- Campos formulario -->
        <validation-observer ref="simpleRules">
          <b-form
            v-if="show"
            class="p-2"
            @submit="onSubmit"
            @reset="onReset"
          >
            <!-- Proveedor -->
            <validation-provider
              #default="{ errors }"
              name="proveedor"
              rules="required"
            >
              <b-form-group
                label="Proveedor:"
                label-for="select-supplier"
              >
                <v-select
                  v-if="suppliers"
                  v-model="form.supplier_id"
                  :options="suppliers"
                  :reduce="supplier => supplier.id"
                  :clearable="true"
                  input-id="select-supplier"
                  required
                  placeholder="Selecciona el proveedor"
                  @search="onSearchSuppliers"
                >
                  <template slot="no-options">
                    Lo siento, no se encontraron proveedores
                  </template>
                </v-select>
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Producto -->
            <validation-provider
              #default="{ errors }"
              name="producto"
              rules="required"
            >
              <b-form-group
                label="Producto:"
                label-for="select-product"
              >
                <v-select
                  v-if="products"
                  v-model="form.product_id"
                  :options="products"
                  :reduce="product => product.id"
                  :clearable="true"
                  input-id="select-product"
                  required
                  placeholder="Selecciona el producto"
                  @search="onSearchProducts"
                >
                  <template slot="no-options">
                    Lo siento, no se encontraron productos
                  </template>
                </v-select>
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Precio -->
            <validation-provider
              #default="{ errors }"
              name="precio"
              rules="required"
            >
              <b-form-group
                label="Precio:"
                label-for="input-price"
              >
                <b-form-input
                  id="input-price"
                  v-model="form.price"
                  class="form-control"
                  placeholder="Ingresa el precio"
                  type="number"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <b-button
              type="submit"
              variant="primary"
            >
              Crear
            </b-button>
            <b-button
              style="margin-left: 5px;"
              type="reset"
              variant="danger"
            >
              Limpiar
            </b-button>

          </b-form>
        </validation-observer>

      </template>

    </b-sidebar>
  </div>
</template>

<script>
import axios from '@axios'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import vSelect from 'vue-select'
import { required } from '@/utils/validations/validations'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    vSelect,
  },
  model: {
    prop: 'priceAddSidebarActive',
    event: 'update:price-add-sidebar-active',
  },
  props: {
    priceAddSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      required,
      form: {
        name: '',
        price: '',
        supplier_id: '',
        product_id: '',
      },
      show: true,

      suppliers: [],
      products: [],
    }
  },

  created() {
    this.getSuppliers()
    this.getProducts()
  },

  methods: {
    getSuppliers() {
      axios
        .get('supplier?perPage=10&sortField=id&sortDesc=desc&filterField=status&filterValue=Y')
        .then(response => {
          response.data.data.forEach(element => {
            this.suppliers.push({
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
      this.suppliers = []
      if (search.length) {
        loading(true)
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          axios
            .get(`supplier?filterField=status&filterValue=Y&query=${search}`)
            .then(response => {
              loading(false)
              this.suppliers = []
              response.data.data.forEach(element => {
                this.suppliers.push({
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

    getProducts() {
      axios
        .get('product?perPage=10&sortField=id&sortDesc=desc&filterField=status&filterValue=Y')
        .then(response => {
          response.data.data.forEach(element => {
            this.products.push({
              label: element.name,
              id: element.id,
            })
          })
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    onSearchProducts(search, loading) {
      this.products = []
      if (search.length) {
        loading(true)
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          axios
            .get(`product?filterField=status&filterValue=Y&query=${search}`)
            .then(response => {
              loading(false)
              this.products = []
              response.data.data.forEach(element => {
                this.products.push({
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

    onSubmit(event) {
      event.preventDefault()
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          axios
            .post('price', this.form)
            .then(() => {
              this.makeToast('success', 'Precio agregado', 'Se ha creado el precio por proveedor')
              this.clearForm()
              this.$emit('update:price-add-sidebar-active', false)
              this.$emit('refreshData')
            })
            .catch(error => {
              this.showErrors(error)
            })
        } else {
          this.makeToast('danger', 'Error', 'No es posible crear el precio por proveedor.')
        }
      })
    },

    onReset(event) {
      event.preventDefault()
      this.clearForm()
    },

    clearForm() {
      // Reset our form values
      this.form.name = ''
      this.form.price = ''
      this.form.supplier_id = ''
      this.form.product_id = ''

      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },

    makeToast(variant = null, title = null, message = null) {
      this.$bvToast.toast(message, {
        title,
        variant,
        solid: true,
      })
    },
  },
}
</script>
