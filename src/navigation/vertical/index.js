export default [
  {
    header: 'Menú',
  },
  {
    title: 'Inicio',
    route: 'home',
    icon: 'HomeIcon',
  },
  {
    title: 'Catálogos',
    icon: 'FolderIcon',
    children: [
      {
        title: 'Categorías',
        route: 'catalogs-categories',
      },
      {
        title: 'Medidas',
        route: 'catalogs-units',
      },
      {
        title: 'Productos',
        route: 'catalogs-products',
      },
    ],
  },
  {
    title: 'Contactos',
    icon: 'UsersIcon',
    children: [
      {
        title: 'Clientes',
        route: 'contacts-customers',
      },
      {
        title: 'Proveedores',
        route: 'contacts-suppliers',
      },
    ],
  },
  {
    title: 'Transacciones',
    icon: 'BoxIcon',
    children: [
      {
        title: 'Compras',
        route: 'transactions-purchases',
      },
      {
        title: 'Ventas',
        route: 'transactions-sales',
      },
    ],
  },
  {
    title: 'Informes',
    icon: 'BookIcon',
    children: [
      {
        title: 'Compras',
        route: 'reports-purchases',
      },
      {
        title: 'Ventas',
        route: 'reports-sales',
      },
      {
        title: 'Inventario',
        route: null,
      },
    ],
  },
  {
    title: 'Accesos',
    icon: 'LockIcon',
    children: [
      {
        title: 'Usuarios',
        route: null,
      },
      {
        title: 'Privilegios',
        route: null,
      },
    ],
  },
  {
    title: 'Configuraciones',
    icon: 'ToolIcon',
    children: [
      {
        title: 'Organización',
        route: 'settings-organization',
      },
      {
        title: 'Sucursales',
        route: 'settings-stores',
      },
      {
        title: 'Ubicaciones',
        route: 'settings-locations',
      },
    ],
  },
]
