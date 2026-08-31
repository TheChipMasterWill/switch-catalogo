import { useMemo, useState } from "react";
import "./App.css";
import juegos from "./data/juegos.json";
import { accesorios, configuracionTienda, combos, memorias } from "./data/catalogo";

const dinero = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

function App() {
  const [combo, setCombo] = useState(null);
  const [memoria, setMemoria] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  const capacidadGB = memoria?.capacidadGB || 0;
  const pesoTotal = seleccionados.reduce((total, juego) => total + juego.pesoGB, 0);
  const limiteJuegos = combo?.cantidad || 0;
  const juegosAlLimite = limiteJuegos > 0 && seleccionados.length >= limiteJuegos;
  const juegosCerca = limiteJuegos > 0 && !juegosAlLimite && seleccionados.length >= limiteJuegos - 2;
  const gbAlLimite = capacidadGB > 0 && pesoTotal > capacidadGB;
  const gbCerca = capacidadGB > 0 && !gbAlLimite && pesoTotal / capacidadGB >= 0.85;
  const avisoJuegos = !combo
    ? ""
    : !combo.cantidad
      ? "Esta opción no incluye juegos en el combo."
      : juegosAlLimite
        ? `Ya completaste los ${limiteJuegos} juegos de tu combo.`
        : juegosCerca
          ? `Te quedan ${limiteJuegos - seleccionados.length} juego${limiteJuegos - seleccionados.length === 1 ? "" : "s"} para completar el combo.`
          : "";
  const avisoGB = !memoria
    ? ""
    : gbAlLimite
      ? `Tus juegos ocupan ${pesoTotal.toFixed(1)} GB y superan los ${capacidadGB} GB de la microSD.`
      : gbCerca
        ? `Queda poco espacio: ${(capacidadGB - pesoTotal).toFixed(1)} GB libres de ${capacidadGB} GB.`
        : "";
  const categorias = ["Todos", ...new Set(juegos.map((juego) => juego.categoria))];
  const juegosFiltrados = useMemo(() => juegos.filter((juego) =>
    juego.nombre.toLowerCase().includes(busqueda.toLowerCase()) && (categoria === "Todos" || juego.categoria === categoria)
  ), [busqueda, categoria]);

  const articulosPedido = [
    ...(combo ? [{ id: `combo-${combo.id}`, nombre: combo.nombre, precio: combo.precio, cantidad: 1, detalle: combo.cantidad ? `${seleccionados.length}/${combo.cantidad} juegos` : undefined }] : []),
    ...(memoria ? [{ id: `memoria-${memoria.id}`, nombre: memoria.nombre, precio: memoria.precio, cantidad: 1 }] : []),
    ...carrito,
  ];
  const total = articulosPedido.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  function toggleJuego(juego) {
    if (seleccionados.some((item) => item.id === juego.id)) {
      setSeleccionados(seleccionados.filter((item) => item.id !== juego.id));
      return;
    }
    if (!combo) return window.alert("Primero elige la opción de magia o juegos que quieres comprar.");
    if (!combo.cantidad) return window.alert("Esta opción no incluye juegos. Elige una opción con juegos para armar tu lista.");
    if (seleccionados.length >= combo.cantidad) return;
    if (memoria && pesoTotal + juego.pesoGB > capacidadGB) return;
    setSeleccionados([...seleccionados, juego]);
  }

  function seleccionarCombo(opcion) {
    setCombo(opcion);
    setSeleccionados((actual) => actual.slice(0, opcion.cantidad));
  }

  function agregarAlCarrito(producto) {
    setCarrito((actual) => {
      const encontrado = actual.find((item) => item.id === producto.id);
      return encontrado
        ? actual.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)
        : [...actual, { ...producto, cantidad: 1 }];
    });
    setCarritoAbierto(true);
  }

  function cambiarCantidad(id, cambio) {
    setCarrito((actual) => actual.flatMap((item) => item.id === id
      ? item.cantidad + cambio > 0 ? [{ ...item, cantidad: item.cantidad + cambio }] : []
      : [item]
    ));
  }

  function enviarWhatsApp() {
    if (!articulosPedido.length) return window.alert("Agrega un combo, memoria o accesorio antes de enviar tu pedido.");
    const lineas = articulosPedido.map((item) => `• ${item.nombre}${item.detalle ? ` (${item.detalle})` : ""} × ${item.cantidad} — ${dinero.format(item.precio * item.cantidad)}`);
    if (seleccionados.length) lineas.push("\nJuegos seleccionados:\n" + seleccionados.map((juego) => `• ${juego.nombre} (${juego.pesoGB} GB)`).join("\n"));
    const mensaje = `Hola, quiero hacer este pedido en ${configuracionTienda.nombre}:\n\n${lineas.join("\n")}\n\n*Total: ${dinero.format(total)}*\n\n¿Me confirmas disponibilidad?`;
    const telefono = configuracionTienda.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${telefono ? telefono + "?" : "?"}text=${encodeURIComponent(mensaje)}`, "_blank", "noopener,noreferrer");
  }

  return <main>
    <header className="hero" id="inicio">
      <nav><a className="brand" href="#inicio"><span>◉</span> TheChipMaster</a><div className="nav-links"><a href="#arma-tu-combo">Combos</a><a href="#accesorios">Accesorios</a><button className="cart-link" onClick={() => setCarritoAbierto(true)}>Carrito <b>{carrito.reduce((s, i) => s + i.cantidad, 0)}</b></button></div></nav>
      <div className="hero-content"><p className="eyebrow">Nintendo Switch · Bogotá</p><h1>Tu Switch, llevada<br />al siguiente nivel.</h1><p>Arma tu combo de juegos, elige tu memoria y completa tu setup con accesorios.</p><a className="primary-button" href="#arma-tu-combo">Escoge tu magia <span>→</span></a></div>
      <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
    </header>

    <section className="benefits"><p>✓ Atención personalizada</p><p>✓ Pedido directo por WhatsApp</p><p>✓ Catálogo siempre actualizado</p></section>

    <section className="section" id="arma-tu-combo">
      <div className="section-heading"><p className="eyebrow">Paso a paso</p><h2>Escoge tu magia</h2><p>Compra solo juegos si ya tienes magia, solo magia o la combinación que prefieras.</p></div>
      <div className="selector-grid"><Selector titulo="1. Escoge magia y juegos" opciones={combos} valor={combo?.id} alCambiar={seleccionarCombo} /> <Selector titulo="2. ¿Quieres microSD?" opciones={memorias} valor={memoria?.id} alCambiar={setMemoria} alOmitir={() => setMemoria(null)} textoOmitir="No, ya tengo microSD" /></div>
      <div className="combo-status"><div className={juegosAlLimite ? "limit-danger" : juegosCerca ? "limit-warn" : ""}><strong>{seleccionados.length} / {combo?.cantidad || 0}</strong><span> juegos elegidos</span><progress value={seleccionados.length} max={combo?.cantidad || 1} /></div><div className={gbAlLimite ? "limit-danger" : gbCerca ? "limit-warn" : ""}><strong>{pesoTotal.toFixed(1)} / {capacidadGB || 0} GB</strong><span> espacio usado</span><progress value={pesoTotal} max={capacidadGB || 1} /></div></div>
      <LimitAlerts juegos={avisoJuegos} gb={avisoGB} />
    </section>

    <section className="section catalog-section"><div className="catalog-title"><div><p className="eyebrow">Paso 3</p><h2>Elige tus juegos</h2></div><span>{juegosFiltrados.length} juegos</span></div><input className="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar un juego..." /><div className="filters">{categorias.map((item) => <button key={item} onClick={() => setCategoria(item)} className={categoria === item ? "active" : ""}>{item}</button>)}</div><LimitAlerts juegos={avisoJuegos} gb={avisoGB} /><div className="games-grid">{juegosFiltrados.map((juego) => {
      const seleccionado = seleccionados.some((item) => item.id === juego.id);
      const comboLleno = limiteJuegos > 0 && seleccionados.length >= limiteJuegos;
      const sinEspacio = Boolean(memoria && pesoTotal + juego.pesoGB > capacidadGB);
      const bloqueado = !seleccionado && Boolean((combo && !combo.cantidad) || comboLleno || sinEspacio);
      const motivoBloqueo = combo && !combo.cantidad ? "Sin juegos" : comboLleno ? "Combo lleno" : "Sin espacio";
      return <GameCard key={juego.id} juego={juego} seleccionado={seleccionado} onToggle={toggleJuego} bloqueado={bloqueado} motivoBloqueo={motivoBloqueo} />;
    })}</div></section>

    <section className="section accessories" id="accesorios"><div className="section-heading"><p className="eyebrow">Completa tu pedido</p><h2>Accesorios para tu Switch</h2><p>Agrega lo que necesites a tu carrito.</p></div><div className="accessories-grid">{accesorios.map((producto) => <article className="accessory-card" key={producto.id}><span className="accessory-icon">{producto.icono}</span><p>{producto.categoria}</p><h3>{producto.nombre}</h3><strong>{dinero.format(producto.precio)}</strong><button onClick={() => agregarAlCarrito(producto)}>Agregar al carrito</button></article>)}</div></section>

    {(combo || memoria) && <div className={`mobile-status ${juegosAlLimite || gbAlLimite ? "danger" : juegosCerca || gbCerca ? "warn" : ""}`} aria-live="polite"><span><b>{seleccionados.length} / {combo?.cantidad || 0}</b> juegos</span><span><b>{pesoTotal.toFixed(1)} / {capacidadGB || 0}</b> GB</span></div>}
    <button className="floating-cart" onClick={() => setCarritoAbierto(true)}>🛒 <span>{carrito.reduce((s, i) => s + i.cantidad, 0)}</span></button>
    {carritoAbierto && <CartDrawer items={articulosPedido} accesorios={carrito} total={total} onClose={() => setCarritoAbierto(false)} onChange={cambiarCantidad} onWhatsApp={enviarWhatsApp} />}
    <footer>CHIPMASTER · Tu tienda Nintendo Switch</footer>
  </main>;
}

function Selector({ titulo, opciones, valor, alCambiar, alOmitir, textoOmitir }) { return <div className="selection-card"><h3>{titulo}</h3>{opciones.map((opcion) => <button key={opcion.id} className={valor === opcion.id ? "chosen" : ""} onClick={() => alCambiar(opcion)}><span>{opcion.nombre}</span><strong>{dinero.format(opcion.precio)}</strong></button>)}{alOmitir && <button className={!valor ? "chosen omit-option" : "omit-option"} onClick={alOmitir}><span>{textoOmitir}</span><strong>—</strong></button>}</div>; }
function LimitAlerts({ juegos, gb }) {
  if (!juegos && !gb) return null;
  const peligro = (juegos && juegos.startsWith("Ya completaste")) || (gb && gb.includes("superan"));
  return <div className={`limit-alerts ${peligro ? "danger" : "warn"}`} role="status">{juegos && <p>{juegos}</p>}{gb && <p>{gb}</p>}</div>;
}
function GameCard({ juego, seleccionado, onToggle, bloqueado, motivoBloqueo }) { return <article className={`game-card ${seleccionado ? "selected-card" : ""} ${bloqueado ? "blocked-card" : ""}`}><img src={`${import.meta.env.BASE_URL}${juego.imagen.replace(/^\//, "")}`} alt={`Portada de ${juego.nombre}`} /><div><span>{juego.categoria}</span><h3>{juego.nombre}</h3><p>{juego.pesoGB} GB</p><button onClick={() => onToggle(juego)} disabled={bloqueado}>{seleccionado ? "✓ En mi combo" : bloqueado ? motivoBloqueo : "Agregar al combo"}</button></div></article>; }
function CartDrawer({ items, accesorios, total, onClose, onChange, onWhatsApp }) { return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><button className="close" onClick={onClose}>×</button><p className="eyebrow">Tu pedido</p><h2>Carrito</h2>{items.length ? <><div className="cart-items">{items.map((item) => <div className="cart-item" key={item.id}><div><strong>{item.nombre}</strong>{item.detalle && <small>{item.detalle}</small>}<span>{dinero.format(item.precio * item.cantidad)}</span></div>{accesorios.some((a) => a.id === item.id) && <div className="quantity"><button onClick={() => onChange(item.id, -1)}>−</button><b>{item.cantidad}</b><button onClick={() => onChange(item.id, 1)}>+</button></div>}</div>)}</div><div className="cart-total"><span>Total</span><strong>{dinero.format(total)}</strong></div><button className="whatsapp-button" onClick={onWhatsApp}>WhatsApp Business <span>↗</span></button></> : <p className="empty">Todavía no has agregado productos.</p>}<small className="availability">El pedido queda sujeto a confirmación de disponibilidad.</small></aside></div>; }
export default App;
