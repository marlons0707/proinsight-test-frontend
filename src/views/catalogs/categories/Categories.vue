<template>

  <div>
    <categories-add
      :categorie-add-sidebar-active.sync="categorieAddSidebarActive"
      @refreshData="getCategories"
    />

    <categories-edit
      v-if="updateShow"
      :category-id="categoryId"
      :categorie-edit-sidebar-active.sync="categorieEditSidebarActive"
      @refreshData="getCategories"
    />

    <!-- Table Container Card -->
    <b-card
      no-body
    >

      <div class="m-2">

        <!-- Table Top -->
        <b-row>

          <!-- Per Page -->
          <b-col
            cols="12"
            md="6"
            class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
          >
            <label>Mostrar</label>
            <v-select
              v-model="perPage"
              :options="perPageOptions"
              :clearable="false"
              class="per-page-selector d-inline-block ml-50 mr-1"
            />
            <b-button
              _class="btn-icon rounded-circle"
              variant="primary"
              @click="categorieAddSidebarActive = true"
            >
              <!-- <feather-icon icon="PlusIcon" /> -->
              Nuevo
            </b-button>
          </b-col>

          <!-- Search -->
          <b-col
            cols="12"
            md="6"
          >
            <div class="d-flex align-items-center justify-content-end">
              <b-form-input
                v-model="searchQuery"
                class="d-inline-block mr-1"
                placeholder="Buscar..."
              />
            </div>
          </b-col>
        </b-row>

      </div>

      <b-table
        class="position-relative"
        hover
        responsive
        primary-key="id"
        show-empty
        empty-text="No se encontraron registros coincidientes"
        :items="categoriesData"
        :fields="categoriesFields"
        :per-page="perPage"
      >

        <template #head(id)="data">
          <span
            class="text-secondary pointer"
            @click="sortColumn(data.column)"
          >{{ data.label }}
          </span>
        </template>

        <template #head(name)="data">
          <span
            class="text-secondary pointer"
            @click="sortColumn(data.column)"
          >{{ data.label }}
          </span>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <div class="text-nowrap">
            <!-- Dropdown -->
            <b-dropdown
              variant="link"
              no-caret
            >
              <template #button-content>
                <feather-icon
                  icon="MoreVerticalIcon"
                  size="16"
                  class="align-middle text-body"
                />
              </template>
              <b-dropdown-item
                @click="updateCategory(data.item.id)"
              >
                <feather-icon icon="Edit2Icon" />
                <span class="align-middle ml-50">Editar</span>
              </b-dropdown-item>
              <b-dropdown-item
                @click="deleteCategory(data.item.id)"
              >
                <feather-icon icon="TrashIcon" />
                <span class="align-middle ml-50">Eliminar</span>
              </b-dropdown-item>
            </b-dropdown>
          </div>
        </template>

      </b-table>

      <div class="mx-2 mb-2">
        <b-row>

          <!-- Pagination info -->
          <b-col
            v-if="categoriesMeta"
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <span class="text-muted">Mostrando del {{ categoriesMeta.from }} al {{ categoriesMeta.to }} de {{ categoriesMeta.total }} registros</span>
          </b-col>

          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >

            <b-pagination
              v-if="categoriesMeta"
              v-model="currentPage"
              :total-rows="categoriesMeta.total"
              :per-page="perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon
                  icon="ChevronLeftIcon"
                  size="18"
                />
              </template>
              <template #next-text>
                <feather-icon
                  icon="ChevronRightIcon"
                  size="18"
                />
              </template>
            </b-pagination>
          </b-col>

        </b-row>
      </div>
    </b-card>
  </div>

</template>

<script>
import axios from '@axios'
import vSelect from 'vue-select'
import CategoriesAdd from './CategoriesAdd.vue'
import CategoriesEdit from './CategoriesEdit.vue'

export default {
  components: {
    vSelect,
    CategoriesAdd,
    CategoriesEdit,
  },

  data() {
    return {
      categorieAddSidebarActive: false,
      categorieEditSidebarActive: false,

      searchQuery: '',

      sortField: 'id',
      sortDesc: 'desc',

      perPage: 10,
      perPageOptions: [5, 10, 25, 50, 100],
      currentPage: 1,

      categoriesFields: [
        { key: 'actions', label: 'Acciones' },
        { key: 'id', label: '#' },
        { key: 'name', label: 'Nombre' },
        { key: 'description', label: 'Descripción' },
        { key: 'status', label: 'Estado' },
        { key: 'created_at', label: 'Creado' },
        { key: 'updated_at', label: 'Actualizado' },
      ],
      categoriesData: null,
      categoriesMeta: null,

      updateShow: false,
      categoryId: 0,
    }
  },

  watch: {
    perPage() {
      this.getCategories()
    },
    currentPage() {
      this.getCategories()
    },
    searchQuery() {
      this.getCategories()
    },
  },

  created() {
    this.getCategories()
  },

  methods: {
    getCategories() {
      axios
        .get(`category?perPage=${this.perPage}&page=${this.currentPage}&query=${this.searchQuery}&sortField=${this.sortField}&sortDesc=${this.sortDesc}`)
        .then(response => {
          this.categoriesMeta = response.data.meta
          this.categoriesData = response.data.data
        })
        .catch(error => {
          this.showErrors(error)
        })
    },

    updateCategory(id) {
      this.updateShow = true
      this.categorieEditSidebarActive = true
      this.categoryId = id
    },

    deleteCategory(id) {
      this.$bvModal
        .msgBoxConfirm('¿Deseas eliminar la categoría?', {
          title: 'Eliminar categoría',
          size: 'sm',
          okVariant: 'danger',
          okTitle: 'SI',
          cancelTitle: 'NO',
          okTitleVariant: 'outline-danger',
          hideHeaderClose: false,
          centered: true,
        })
        .then(value => {
          if (value) {
            axios
              .delete(`category/${id}`)
              .then(response => {
                this.makeToast('success', 'Categoría eliminada', `Se ha eliminado la categoría ${response.data.data.name}.`)
                this.getCategories()
              })
              .catch(error => {
                this.showErrors(error)
              })
          }
        })
    },

    sortColumn(field) {
      if (this.sortField === field) {
        if (this.sortDesc === 'asc') {
          this.sortDesc = 'desc'
        } else {
          this.sortDesc = 'asc'
        }
      } else {
        this.sortField = field
        this.sortDesc = 'asc'
      }
      this.getCategories()
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

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
.pointer {
  cursor: pointer;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
