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
      :visible="productAddSidebarActive"
      @change="(val) => $emit('update:product-add-sidebar-active', val)"
    >

      <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Nuevo producto
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

            <!-- SKU -->
            <validation-provider
              #default="{ errors }"
              name="SKU"
              rules="required"
            >
              <b-form-group
                label="SKU:"
                label-for="input-sku"
              >
                <b-form-input
                  id="input-sku"
                  v-model="form.sku"
                  placeholder="Ingresa un SKU"
                  required
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Presentación -->
            <validation-provider
              #default="{ errors }"
              name="presentación"
              rules="required"
            >
              <b-form-group
                label="Presentación:"
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
                  placeholder="Selecciona la presentación"
                  @search="onSearchUnits"
                >
                  <template slot="no-options">
                    Lo siento, no se encontraron presentaciones
                  </template>
                </v-select>
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Volumen -->
            <validation-provider
              #default="{ errors }"
              name="volumen"
              rules="required"
            >
              <b-form-group
                label="Volumen (Ancho x Largo x Alto):"
                label-for="input-vol"
              >
                <b-form-input
                  id="input-vol"
                  v-model="form.volume"
                  placeholder="Ingresa el volumen del producto"
                  required
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <!-- Unidades por caja -->
            <validation-provider
              #default="{ errors }"
              name="unidades por caja"
              rules="required"
            >
              <b-form-group
                label="Unidades por caja:"
                label-for="input-per-boc"
              >
                <b-form-input
                  id="input-per-boc"
                  v-model="form.units_per_box"
                  class="form-control"
                  placeholder="Ingresa unidades por caja"
                  type="number"
                />
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
                  placeholder="Selecciona la categoría"
                  @search="onSearchCategories"
                >
                  <template slot="no-options">
                    Lo siento, no se encontraron categorías
                  </template>
                </v-select>
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
    prop: 'productAddSidebarActive',
    event: 'update:product-add-sidebar-active',
  },
  props: {
    productAddSidebarActive: {
      type: Boolean,
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
        sku: '',
        volume: '',
        units_per_box: '',
      },
      show: true,
      categories: [],
      units: [],
    }
  },
  created() {
    this.getUnits()
    this.getCategories()
  },

  methods: {
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

    onSubmit(event) {
      event.preventDefault()

      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          axios
            .post('product', this.form)
            .then(response => {
              this.makeToast('success', 'Producto agregado', `Se ha creado el producto ${response.data.data.name}.`)
              this.clearForm()
              this.$emit('update:product-add-sidebar-active', false)
              this.$emit('refreshData')
            })

            .catch(error => {
              this.showErrors(error)
            })
        } else {
          this.makeToast('danger', 'Error', 'No es posible crear el producto.')
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
      this.form.description = ''
      this.form.unit_id = ''
      this.form.category_id = ''
      this.form.sku = ''
      this.form.volume = ''
      this.form.units_per_box = ''

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
