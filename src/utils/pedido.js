// Las líneas físicas se resuelven desde el inventario central, sin copiar sus datos al carrito.
export function construirPedido({ combo, memoria, seleccionados, carrito, productos }) {
  const fisicos = new Map();
  function incluir(producto, cantidad) {
    if (!producto || producto.disponible !== true || !(producto.precio > 0)) return;
    const actual = fisicos.get(producto.id);
    fisicos.set(producto.id, {
      ...producto,
      cantidad: (actual?.cantidad || 0) + cantidad,
    });
  }
  if (memoria) incluir(productos.find((producto) => producto.id === memoria.id), 1);
  carrito.forEach((linea) => incluir(productos.find((producto) => producto.id === linea.id), linea.cantidad));
  return [
    ...(combo ? [{ id: `combo-${combo.id}`, nombre: combo.nombre, precio: combo.precio, cantidad: 1,
      detalle: combo.cantidad ? `${seleccionados.length}/${combo.cantidad} juegos` : undefined }] : []),
    ...fisicos.values(),
  ];
}
