// =====================================================
// CHIPMASTER SELECT - CATÁLOGO DE PRODUCTOS
// =====================================================
// EDITA AQUÍ nombres, precios, stock y disponibilidad.
// No necesitas modificar App.jsx para cambiar precios.
//
// precio: valor en pesos colombianos.
// precio: 0 = consultar precio por WhatsApp.
// disponible: true = visible; con precio > 0 se puede comprar; false = oculto.
// capacidadGB: capacidad de las microSD, usada también en el selector del combo.
//
// condicion:
// - "Nueva"
// - "Segunda mano"
// - "Nuevo" cuando corresponda a accesorios
// =====================================================

export const productos = [

  // ===================================================
  // CONSOLAS
  // ===================================================

  {
    id: "xbox-360",
    nombre: "Xbox 360",
    categoria: "Consolas",
    condicion: "Segunda mano",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/xbox-360.jpg",
  },

  {
    id: "xbox-series-s",
    nombre: "Xbox Series S",
    categoria: "Consolas",
    condicion: "Nueva",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/xbox-series-s.jpg",
  },

  {
    id: "xbox-series-x",
    nombre: "Xbox Series X",
    categoria: "Consolas",
    condicion: "Nueva",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/xbox-series-x.jpg",
  },

  {
    id: "ps4",
    nombre: "PlayStation 4",
    categoria: "Consolas",
    condicion: "Segunda mano",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/ps4.jpg",
  },

  {
    id: "ps5",
    nombre: "PlayStation 5",
    categoria: "Consolas",
    condicion: "Nueva",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/ps5.jpg",
  },

  {
    id: "switch",
    nombre: "Nintendo Switch",
    categoria: "Consolas",
    condicion: "Nueva",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/switch.jpg",
  },

  {
    id: "switch-oled",
    nombre: "Nintendo Switch OLED",
    categoria: "Consolas",
    condicion: "Nueva",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/switch-oled.jpg",
  },

  {
    id: "switch-lite",
    nombre: "Nintendo Switch Lite",
    categoria: "Consolas",
    condicion: "Nueva",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/switch-lite.jpg",
  },


  // ===================================================
  // CONTROLES
  // ===================================================

  {
    id: "control-xbox-360",
    nombre: "Control Xbox 360",
    categoria: "Controles",
    condicion: "Nuevo",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/control-xbox-360.jpg",
  },

  {
    id: "control-xbox-series",
    nombre: "Control Xbox Series",
    categoria: "Controles",
    condicion: "Nuevo",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/control-xbox-series.jpg",
  },

  {
    id: "control-ps4",
    nombre: "Control PS4",
    categoria: "Controles",
    condicion: "Nuevo",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/control-ps4.jpg",
  },

  {
    id: "control-ps5",
    nombre: "Control PS5 DualSense",
    categoria: "Controles",
    condicion: "Nuevo",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/control-ps5.jpg",
  },

  {
    id: "joy-con",
    nombre: "Nintendo Joy-Con",
    categoria: "Controles",
    condicion: "Nuevo",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/joy-con.jpg",
  },

  {
    id: "pro-controller",
    nombre: "Nintendo Switch Pro Controller",
    categoria: "Controles",
    condicion: "Nuevo",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/pro-controller.jpg",
  },


  // ===================================================
  // ALMACENAMIENTO
  // ===================================================

  {
    id: "microsd-128",
    capacidadGB: 128,
    nombre: "MicroSD 128 GB",
    categoria: "Almacenamiento",
    condicion: "Nuevo",
    precio: 90000,
    disponible: true,
    destacado: false,
    imagen: "/productos/microsd-128.webp",
  },

  {
    id: "microsd-256",
    capacidadGB: 256,
    nombre: "MicroSD 256 GB",
    categoria: "Almacenamiento",
    condicion: "Nuevo",
    precio: 160000,
    disponible: true,
    destacado: true,
    imagen: "/productos/microsd-256.webp",
  },

  {
    id: "microsd-512",
    capacidadGB: 512,
    nombre: "MicroSD 512 GB",
    categoria: "Almacenamiento",
    condicion: "Nuevo",
    precio: 350000,
    disponible: true,
    destacado: false,
    imagen: "/productos/microsd-512.webp",
  },


  // ===================================================
  // PROTECCIÓN
  // ===================================================

  {
    id: "estuche-switch",
    nombre: "Kit estuche protector para Nintendo Switch 2",
    categoria: "Protección",
    condicion: "Nuevo",
    precio: 69900,
    disponible: true,
    destacado: false,
    imagen: "/productos/estuche-switch.jpeg",
  },

  {
    id: "mica-switch",
    nombre: "Vidrio templado para Switch",
    categoria: "Protección",
    condicion: "Nuevo",
    precio: 25000,
    disponible: true,
    destacado: false,
    imagen: "/productos/vidrio-templado.webp",
  },


  // ===================================================
  // ENERGÍA Y CABLES
  // ===================================================

  {
    id: "cargador-switch",
    nombre: "Cargador USB-C para Switch",
    categoria: "Energía",
    condicion: "Nuevo",
    precio: 65000,
    disponible: true,
    destacado: false,
    imagen: "/productos/cargador-switch.jpg",
  },


  // ===================================================
  // AUDIO Y GAMING
  // ===================================================

  {
    id: "audifonos-gaming",
    nombre: "Audífonos Gaming",
    categoria: "Audio & Gaming",
    condicion: "Nuevo",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/audifonos-gaming.jpg",
  },


  // ===================================================
  // ACCESORIOS
  // ===================================================

  {
    id: "control-inalambrico",
    nombre: "Control RGB inalámbrico",
    categoria: "Accesorios",
    condicion: "Nuevo",
    precio: 90000,
    disponible: true,
    destacado: false,
    imagen: "/productos/control-inalambrico.jpeg",
  },

  {
    id: "base-switch",
    nombre: "Base para Nintendo Switch",
    categoria: "Accesorios",
    condicion: "Nuevo",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/base-switch.jpg",
  },

  {
    id: "adaptador-usb",
    nombre: "Adaptador USB",
    categoria: "Accesorios",
    condicion: "Nuevo",
    precio: 0,
    disponible: false,
    destacado: false,
    imagen: "/productos/adaptador-usb.jpg",
  },

  {
    id: "bateria-switch-normal-oled",
    nombre: "Batería para Nintendo Switch normal y OLED",
    categoria: "Repuestos",
    condicion: "Nueva",
    precio: 150000,
    disponible: true,
    destacado: false,
    imagen: "/productos/bateria-switch-normal-oled.webp",
  },

  // REPUESTOS DE CONSOLAS Y CONTROLES
  // Agrega aquí cada pieza con un id único y categoria: "Repuestos".
  // Usa nombre específico (pieza y modelo), condicion, precio, disponible e imagen.
  // precio: 0 permite consultar por WhatsApp; disponible: false oculta la pieza.

];
// Las categorías se generan desde el inventario visible. Repuestos conserva su acceso mientras se carga el inventario.
export const productosDisponibles = productos.filter((producto) => producto.disponible === true);
export const categoriasTienda = ["Todos", ...new Set([...productosDisponibles.map((producto) => producto.categoria), "Repuestos"])];
