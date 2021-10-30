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
      :visible="locationEditSidebarActive"
      @change="(val) => $emit('update:location-edit-sidebar-active', val)"
    >

      <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Editar ubicación
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
            <validation-provider
              #default="{ errors }"
              name="nombre"
              rules="required"
            >
              <b-form-group
                label="Ubicación:"
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

            <validation-provider
              #default="{ errors }"
              name="sucursal"
              rules="required"
            >
              <!-- Sucursal -->
              <b-form-group
                label="Sucursal:"
                label-for="select-store"
              >
                <v-select
                  v-if="stores"
                  v-model="form.store_id"
                  :options="stores"
                  :reduce="store => store.id"
                  :clearable="true"
                  input-id="select-store"
                  required
                  @search="onSearchStores"
                >
                  <template slot="no-options">
                    Lo siento, no se encontraron sucursales
                  </template>
                </v-select>
                <small class="text-danger">{{ errors[0] }}</small>
              </b-form-group>
            </validation-provider>

            <b-button
              type="submit"
              variant="primary"
            >
              Actualizar
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
    prop: 'locationEditSidebarActive',
    event: 'update:location-edit-sidebar-active',
  },
  props: {
    locationEditSidebarActive: {
      type: Boolean,
      required: true,
    },
    locationId: {
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
        store_id: '',
      },
      show: true,
      stores: [],
    }
  },

  watch: {
    locationEditSidebarActive(val) {
      if (val) {
        this.getLocation()
      }
    },
  },
  created() {
    this.getLocation()
    this.getStores()
  },

  methods: {
    getStores() {
      axios
        .get('store?perPage=10&sortField=id&sortDesc=desc&filterField=status&filterValue=Y')
        .then(response => {
          response.data.data.forEach(element => {
            this.stores.push({
              label: element.name,
              id: element.id,
            })
          })
        })
        .catch(error => {
          this.showErrors(error)
        })
    },
    onSearchStores(search, loading) {
      this.stores = []
      if (search.length) {
        loading(true)
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          axios
            .get(`store?filterField=status&filterValue=Y&query=${search}`)
            .then(response => {
              loading(false)
              this.stores = []
              response.data.data.forEach(element => {
                this.stores.push({
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
        this.getStores()
      }
    },

    getLocation() {
      axios
        .get(`location/${this.locationId}`)
        .then(response => {
          this.form.name = response.data.data.name
          this.form.description = response.data.data.description
          this.form.store_id = response.data.data.store_id
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    onSubmit(event) {
      event.preventDefault()

      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          axios
            .put(`location/${this.locationId}`, this.form)
            .then(response => {
              this.makeToast('success', 'Ubicación actualizada', `Se actualizó la ubicación a: ${response.data.data.name}.`)
              this.clearForm()
              this.$emit('update:location-edit-sidebar-active', false)
              this.$emit('refreshData')
            })
            .catch(error => {
              this.showErrors(error)
            })
        } else {
          this.makeToast('danger', 'Error', 'No es posible actualizar la ubicación.')
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
