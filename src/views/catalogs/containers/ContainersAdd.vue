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
      :visible="containerAddSidebarActive"
      @change="(val) => $emit('update:container-add-sidebar-active', val)"
    >

      <template #default="{ hide }">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center content-sidebar-header px-2 py-1">
          <h5 class="mb-0">
            Nuevo contenedor
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
                label="Contenedor:"
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

            <!-- Tipo -->
            <validation-provider
              #default="{ errors }"
              name="tipo"
              rules="required"
            >
              <b-form-group
                label="Tipo:"
                label-for="select-unit"
              >
                <v-select
                  v-if="types"
                  v-model="form.type"
                  :options="types"
                  :reduce="type => type.id"
                  :clearable="true"
                  input-id="select-type"
                  required
                  placeholder="Selecciona el tipo de contenedor"
                >
                  <template slot="no-options">
                    Lo siento, no se encontraron tipos de contenedores
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
    prop: 'containerAddSidebarActive',
    event: 'update:container-add-sidebar-active',
  },
  props: {
    containerAddSidebarActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      required,

      form: {
        name: '',
        type: '',
      },
      show: true,

      types: [
        { id: 'air', label: 'Aéreo' },
        { id: 'sea', label: 'Marítimo' },
        { id: 'land', label: 'Terrestre' },
      ],
    }
  },

  methods: {
    onSubmit(event) {
      event.preventDefault()

      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          axios
            .post('container', this.form)
            .then(response => {
              this.makeToast('success', 'Contenedor agregado', `Se ha creado el contenedor ${response.data.data.name}.`)
              this.clearForm()
              this.$emit('update:container-add-sidebar-active', false)
              this.$emit('refreshData')
            })

            .catch(error => {
              this.showErrors(error)
            })
        } else {
          this.makeToast('danger', 'Error', 'No es posible crear el contenedor.')
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
      this.form.type = ''

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
