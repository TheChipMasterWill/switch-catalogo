import { productos } from "./productos";

// Edita aquí los servicios y la configuración de la tienda.
// Todos los productos físicos y sus precios se editan en productos.js.
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

// El selector comparte precio, condición y disponibilidad con la tienda.
export const memorias = productos.filter((producto) =>
  producto.disponible === true && producto.capacidadGB > 0 && producto.precio > 0
);
