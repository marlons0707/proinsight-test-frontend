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
      :visible="productEditSidebarActive"
      @change="(val) => $emit('update:product-edit-sidebar-active', val)"
    >

      <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Editar producto
          </h5>
          <feather-icon
            class="ml-1 cursor-pointer"
            icon="XIcon"
            size="16"
            @click="hide"
          />
        </div>

        <!-- Campos formulario -->
        <!-- Campos formulario -->
        <validation-observer ref="simpleRules">
          <b-form
            v-if="show"
            class="p-2"
            @submit="onSubmit"
          >
            <!-- Producto -->
            <validation-provider
              #default="{ errors }"
              name="nombre"
              rules="required"
            >
              <b-form-group
                label="Producto:"
                label-for="input-name"
              >
                <b-form-input
                  id="input-name"
                  v-model="form.name"
                  placeholder="Ingresa el nombre"
                  required
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Descripción -->
            <validation-provider
              #default="{ errors }"
              name="descripción"
            >
              <b-form-group
                label="Descripción:"
                label-for="input-description"
              >
                <b-form-input
                  id="input-description"
                  v-model="form.description"
                  placeholder="Ingresa una descripción"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Medida -->
            <validation-provider
              #default="{ errors }"
              name="unidad de medida"
              rules="required"
            >
              <b-form-group
                label="Unidad de Medida:"
                label-for="select-unit"
              >
                <v-select
                  v-if="units"
                  v-model="form.unit_id"
                  :options="units"
                  :reduce="unit => unit.id"
                  :clearable="true"
                  input-id="select-unit"
                  required
                  @search="onSearchUnits"
                >
                  <template slot="no-options">
                    Lo siento, no se encontraron unidades de medida
                  </template>
                </v-select>
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Categoría -->
            <validation-provider
              #default="{ errors }"
              name="categoría"
              rules="required"
            >
              <b-form-group
                label="Categoría:"
                label-for="select-category"
              >
                <v-select
                  v-if="categories"
                  v-model="form.category_id"
                  :options="categories"
                  :reduce="category => category.id"
                  :clearable="true"
                  input-id="select-category"
                  required
                  @search="onSearchCategories"
                >
                  <template slot="no-options">
                    Lo siento, no se encontraron categorías
                  </template>
                </v-select>
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Ubicación -->
            <validation-provider
              #default="{ errors }"
              name="ubicación"
              rules="required"
            >
              <b-form-group
                label="Ubicación:"
                label-for="select-location"
              >
                <v-select
                  v-if="locations"
                  v-model="form.location_id"
                  :options="locations"
                  :reduce="location => location.id"
                  :clearable="true"
                  input-id="select-location"
                  required
                  @search="onSearchLocations"
                >
                  <template
                    slot="option"
                    slot-scope="option"
                  >
                    {{ option.label }} - {{ option.store }}
                  </template>
                  <template slot="no-options">
                    Lo siento, no se encontraron ubicaciones
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
                  placeholder="Precio en quetzales"
                  type="number"
                  min="1"
                  step="any"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Costo -->
            <validation-provider
              #default="{ errors }"
              name="costo"
              rules="required"
            >
              <b-form-group
                label="Costo:"
                label-for="input-cost"
              >
                <b-form-input
                  id="input-cost"
                  v-model="form.cost"
                  class="form-control"
                  placeholder="Costo en quetzales"
                  type="number"
                  min="1"
                  step="any"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Stock actual -->
            <b-form-group
              label="Stock actual:"
              label-for="input-stock"
            >
              <b style="font-size: 25px">{{ form.stock }}</b>
            </b-form-group>

            <b-button
              type="submit"
              variant="primary"
            >
              Actualizar
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
    prop: 'productEditSidebarActive',
    event: 'update:product-edit-sidebar-active',
  },
  props: {
    productEditSidebarActive: {
      type: Boolean,
      required: true,
    },
    productId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      required,
      form: {
        name: '',
        description: '',
        unit_id: '',
        category_id: '',
        location_id: '',
        stock: 0,
        price: '',
        cost: '',
      },
      show: true,
      categories: [],
      units: [],
      locations: [],
    }
  },

  watch: {
    productEditSidebarActive(val) {
      if (val) {
        this.getProduct()
      }
    },
  },
  created() {
    this.getProduct()
    this.getUnits()
    this.getCategories()
    this.getLocations()
  },

  methods: {

    getProduct() {
      axios
        .get(`product/${this.productId}`)
        .then(response => {
          this.form.name = response.data.data.name
          this.form.description = response.data.data.description

          this.form.unit_id = response.data.data.unit_id
          this.form.category_id = response.data.data.category_id
          this.form.location_id = response.data.data.location_id
          this.form.stock = response.data.data.stock
          this.form.price = response.data.data.price
          this.form.cost = response.data.data.cost
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    getUnits() {
      axios
        .get('unit?perPage=10&sortField=id&sortDesc=desc&filterField=status&filterValue=Y')
        .then(response => {
          response.data.data.forEach(element => {
            this.units.push({
              label: element.name,
              id: element.id,
            })
          })
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    onSearchUnits(search, loading) {
      this.units = []
      if (search.length) {
        loading(true)
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          axios
            .get(`unit?filterField=status&filterValue=Y&query=${search}`)
            .then(response => {
              loading(false)
              this.units = []
              response.data.data.forEach(element => {
                this.units.push({
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
        this.getUnits()
      }
    },

    getCategories() {
      axios
        .get('category?perPage=10&sortField=id&sortDesc=desc&filterField=status&filterValue=Y')
        .then(response => {
          response.data.data.forEach(element => {
            this.categories.push({
              label: element.name,
              id: element.id,
            })
          })
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    onSearchCategories(search, loading) {
      this.categories = []
      if (search.length) {
        loading(true)
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          axios
            .get(`category?filterField=status&filterValue=Y&query=${search}`)
            .then(response => {
              loading(false)
              this.categories = []
              response.data.data.forEach(element => {
                this.categories.push({
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
        this.getCategories()
      }
    },

    getLocations() {
      axios
        .get('location?perPage=10&sortField=id&sortDesc=desc&filterField=status&filterValue=Y')
        .then(response => {
          response.data.data.forEach(element => {
            this.locations.push({
              label: element.name,
              id: element.id,
              store: element.store_name,
            })
          })
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    onSearchLocations(search, loading) {
      this.locations = []
      if (search.length) {
        loading(true)
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          axios
            .get(`location?filterField=status&filterValue=Y&query=${search}`)
            .then(response => {
              loading(false)
              this.locations = []
              response.data.data.forEach(element => {
                this.locations.push({
                  label: element.name,
                  id: element.id,
                  store: element.store_name,
                })
              })
            })
            .catch(error => {
              this.showErrors(error)
            })
        }, 300)
      } else {
        this.getLocations()
      }
    },

    onSubmit(event) {
      event.preventDefault()

      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          axios
            .put(`product/${this.productId}`, this.form)
            .then(response => {
              this.makeToast('success', 'Producto actualizado', `Se actualizó el producto a: ${response.data.data.name}.`)
              this.clearForm()
              this.$emit('update:product-edit-sidebar-active', false)
              this.$emit('refreshData')
            })
            .catch(error => {
              this.showErrors(error)
            })
        } else {
          this.makeToast('danger', 'Error', 'No es posible actualizar el producto.')
        }
      })
    },

    clearForm() {
      // Reset our form values
      this.form.name = ''
      this.form.description = ''

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
