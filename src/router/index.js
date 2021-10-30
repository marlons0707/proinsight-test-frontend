import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: 'Inicio',
        breadcrumb: [
          {
            text: 'Inicio',
            active: true,
          },
        ],
      },
    },

    // Catalogs
    // =====================================================================
    {
      path: '/catalogos/categorias',
      name: 'catalogs-categories',
      component: () => import('@/views/catalogs/categories/Categories.vue'),
      meta: {
        pageTitle: 'Categorías',
        breadcrumb: [
          {
            text: 'Catálogos',
            link: true,
          },
          {
            text: 'Categorías',
            active: true,
          },
        ],
      },
    },
    {
      path: '/catalogos/medidas',
      name: 'catalogs-units',
      component: () => import('@/views/catalogs/units/Units.vue'),
      meta: {
        pageTitle: 'Medidas',
        breadcrumb: [
          {
            text: 'Catálogos',
            link: true,
          },
          {
            text: 'Unidades de Medidas',
            active: true,
          },
        ],
      },
    },
    {
      path: '/catalogo/productos',
      name: 'catalogs-products',
      component: () => import('@/views/catalogs/products/Products.vue'),
      meta: {
        pageTitle: 'Productos',
        breadcrumb: [
          {
            text: 'Catálogos',
            link: true,
          },
          {
            text: 'Productos',
            active: true,
          },
        ],
      },
    },

    // Contacts
    // =====================================================================
    {
      path: '/contactos/proveedores',
      name: 'contacts-suppliers',
      component: () => import('@/views/contacts/suppliers/Suppliers.vue'),
      meta: {
        pageTitle: 'Proveedores',
        breadcrumb: [
          {
            text: 'Contactos',
            link: true,
          },
          {
            text: 'Proveedores',
            active: true,
          },
        ],
      },
    },

    // Transactions
    // =====================================================================
    {
      path: '/transacciones/compras',
      name: 'transactions-purchases',
      component: () => import('@/views/transactions/purchases/Purchases.vue'),
      meta: {
        pageTitle: 'Compras',
        breadcrumb: [
          {
            text: 'Transacciones',
            link: true,
          },
          {
            text: 'Compras',
            active: true,
          },
        ],
      },
    },

    // Access
    // =====================================================================
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
      },
    },

    // Pages
    // =====================================================================
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
