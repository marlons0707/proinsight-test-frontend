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
      :visible="unitEditSidebarActive"
      @change="(val) => $emit('update:unit-edit-sidebar-active', val)"
    >

      <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Editar Presentación
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
          >
            <validation-provider
              #default="{ errors }"
              name="nombre"
              rules="required"
            >
              <b-form-group
                label="Presentación:"
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
import { required } from '@/utils/validations/validations'

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  model: {
    prop: 'unitEditSidebarActive',
    event: 'update:unit-edit-sidebar-active',
  },
  props: {
    unitEditSidebarActive: {
      type: Boolean,
      required: true,
    },
    unitId: {
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
      },
      show: true,
    }
  },

  watch: {
    unitEditSidebarActive(val) {
      if (val) {
        this.getUnit()
      }
    },
  },
  created() {
    this.getUnit()
  },

  methods: {

    getUnit() {
      axios
        .get(`unit/${this.unitId}`)
        .then(response => {
          this.form.name = response.data.data.name
          this.form.description = response.data.data.description
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
            .put(`unit/${this.unitId}`, this.form)
            .then(response => {
              this.makeToast('success', 'Presentación actualizada', `Se actualizó la presentación a: ${response.data.data.name}.`)
              this.clearForm()
              this.$emit('update:unit-edit-sidebar-active', false)
              this.$emit('refreshData')
            })
            .catch(error => {
              this.showErrors(error)
            })
        } else {
          this.makeToast('danger', 'Error', 'No es posible actualizar la presentación.')
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
