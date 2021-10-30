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
      :visible="storeEditSidebarActive"
      @change="(val) => $emit('update:store-edit-sidebar-active', val)"
    >

      <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Editar Tienda
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
                label="Tienda:"
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
              name="dirección"
              rules="required"
            >
              <b-form-group
                label="Dirección:"
                label-for="input-address"
              >
                <b-form-input
                  id="input-address"
                  v-model="form.address"
                  placeholder="Ingresa una dirección"
                  required
                />
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
import { required } from '@/utils/validations/validations'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  model: {
    prop: 'storeEditSidebarActive',
    event: 'update:store-edit-sidebar-active',
  },
  props: {
    storeEditSidebarActive: {
      type: Boolean,
      required: true,
    },
    storeId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      required,

      form: {
        name: '',
        address: '',
      },
      show: true,
    }
  },

  watch: {
    storeEditSidebarActive(val) {
      if (val) {
        this.getStore()
      }
    },
  },
  created() {
    this.getStore()
  },

  methods: {

    getStore() {
      axios
        .get(`store/${this.storeId}`)
        .then(response => {
          this.form.name = response.data.data.name
          this.form.address = response.data.data.address
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
            .put(`store/${this.storeId}`, this.form)
            .then(response => {
              this.makeToast('success', 'Tienda actualizada', `Se actualizó la Tienda a: ${response.data.data.name}.`)
              this.clearForm()
              this.$emit('update:store-edit-sidebar-active', false)
              this.$emit('refreshData')
            })
            .catch(error => {
              this.showErrors(error)
            })
        } else {
          this.makeToast('danger', 'Error', 'No es posible actualizar Tienda.')
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
      this.form.address = ''

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
