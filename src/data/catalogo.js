// Este es el único archivo que debes editar para precios, combos, memorias y accesorios.
// Para pedidos dirigidos a tu WhatsApp Business, escribe el número con código de país, sin + ni espacios.
export const configuracionTienda = { nombre: "ChipMaster", whatsapp: "573124529952" };

export const combos = [
  { id: "juegos-12", nombre: "12 juegos", cantidad: 12, precio: 20000 },
  { id: "juegos-25", nombre: "25 juegos", cantidad: 25, precio: 30000 },
  { id: "juegos-50", nombre: "50 juegos", cantidad: 50, precio: 40000 },
  { id: "magia-sola", nombre: "Magia sin juegos", cantidad: 0, precio: 90000 },
  { id: "magia-12", nombre: "Magia + 12 juegos", cantidad: 12, precio: 100000 },
  { id: "magia-25", nombre: "Magia + 25 juegos", cantidad: 25, precio: 110000 },
  { id: "magia-50", nombre: "Magia + 50 juegos", cantidad: 50, precio: 120000 },
];

export const memorias = [
  { id: "sd-128", nombre: "MicroSD 128 GB", capacidadGB: 128, precio: 90000 },
  { id: "sd-256", nombre: "MicroSD 256 GB", capacidadGB: 256, precio: 160000 },
  { id: "sd-512", nombre: "MicroSD 512 GB", capacidadGB: 512, precio: 350000 },
];

// Para crear otro accesorio, duplica una línea y cambia id, nombre, categoría, icono y precio.
export const accesorios = [
  { id: "control-inalambrico", nombre: "Control inalámbrico", categoria: "Controles", icono: "🎮", precio: 110000 },
  { id: "estuche-switch", nombre: "Estuche protector", categoria: "Protección", icono: "🧳", precio: 45000 },
  { id: "mica-switch", nombre: "Vidrio templado", categoria: "Protección", icono: "🛡️", precio: 25000 },
  { id: "cargador-switch", nombre: "Cargador USB-C", categoria: "Energía", icono: "🔌", precio: 65000 },
];
