export default defineAppConfig({
    ui: {
      colors: {
      }
    },
    routes:[
        {name:'settings',title:'Configuración',emoji:'🛠', path:'/settings',icons:['mage:settings','mage:settings-fill','duo-icons:settings']},
        {name:'products',title:'Productos',emoji:'📦', path:'/products',icons:['mage:box-3d','mage:box-3d-fill','duo-icons:box-2']},
        {name:'dashboard',title:'Resumen',emoji:'📊', path:'/',icons:['mage:dashboard-chart-arrow','mage:dashboard-chart-arrow-fill','duo-icons:align-bottom']},
        {name:'record',title:'Registro',emoji:'📝', path:'/record',icons:['mage:clipboard','mage:clipboard-fill','duo-icons:clipboard',]},
    ]
  })
  