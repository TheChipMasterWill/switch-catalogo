import { useEffect, useMemo, useState } from "react";
import "./App.css";
import juegos from "./data/juegos.json";
import { configuracionTienda, combos, memorias } from "./data/catalogo";
import { productos, productosDisponibles, categoriasTienda } from "./data/productos";
import { servicios, categoriasServicios } from "./data/servicios";
import { construirPedido } from "./utils/pedido";

function enlaceConsulta(producto) {
  const telefono = configuracionTienda.whatsapp.replace(/\D/g, "");
  const mensaje = `Hola, quisiera consultar el precio y la disponibilidad de ${producto.nombre}${producto.condicion ? ` (${producto.condicion})` : ""} en ${configuracionTienda.nombre}.`;
  return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
}

const dinero = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

function paginaActual() {
  if (window.location.hash.startsWith("#/catalogo")) return "catalogo";
  if (window.location.hash.startsWith("#/servicios")) return "servicios";
  return "tienda";
}

function App() {
  const [pagina, setPagina] = useState(paginaActual);
  const esCatalogo = pagina === "catalogo";
  const esServicios = pagina === "servicios";
  const [categoriaServicio, setCategoriaServicio] = useState("Todos");
  useEffect(() => {
    function actualizarPagina() {
      setPagina(paginaActual());
      window.scrollTo(0, 0);
    }
    window.addEventListener("hashchange", actualizarPagina);
    return () => window.removeEventListener("hashchange", actualizarPagina);
  }, []);
  useEffect(() => {
    document.title = esCatalogo ? "Catálogo de juegos | TheChipMaster" : esServicios ? "Servicios | TheChipMaster" : "Tienda TheChipMaster";
  }, [esCatalogo, esServicios]);
  const [combo, setCombo] = useState(null);
  const [memoria, setMemoria] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [categoriaTienda, setCategoriaTienda] = useState("Todos");
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
  const productosFiltrados = useMemo(() => productosDisponibles.filter((producto) =>
    categoriaTienda === "Todos" || producto.categoria === categoriaTienda
  ), [categoriaTienda]);
  const articulosPedido = construirPedido({ combo, memoria, seleccionados, carrito, productos });
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
    if (producto.disponible !== true || !(producto.precio > 0)) return;
    setCarrito((actual) => {
      const encontrado = actual.find((item) => item.id === producto.id);
      return encontrado
        ? actual.map((item) => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)
        : [...actual, { id: producto.id, cantidad: 1 }];
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
  if (!articulosPedido.length) {
    return window.alert("Agrega al menos un producto o servicio antes de enviar tu pedido.");
  }
  const lineas = articulosPedido.map((item) => `• ${item.nombre}${item.condicion ? ` (${item.condicion})` : ""}${item.detalle ? ` (${item.detalle})` : ""} × ${item.cantidad} — ${dinero.format(item.precio * item.cantidad)}`);
    if (seleccionados.length) lineas.push("\nJuegos seleccionados:\n" + seleccionados.map((juego) => `• ${juego.nombre} (${juego.pesoGB} GB)`).join("\n"));
    const mensaje = `Hola, quiero hacer este pedido en ${configuracionTienda.nombre}:\n\n${lineas.join("\n")}\n\n*Total: ${dinero.format(total)}*\n\n¿Me confirmas disponibilidad?`;
    const telefono = configuracionTienda.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener,noreferrer");
  }

  return <main>
    <header className="hero" id="inicio">
      <nav aria-label="Navegación principal">
        <a className="brand" href="#/" aria-label="TheChipMaster — Inicio">
          <span className="brand-icon" aria-hidden="true">◉</span>
          <span className="brand-name" aria-hidden="true">
            {Array.from("TheChipMaster").map((letter, index) => <span className="brand-letter" key={index}>{letter}</span>)}
          </span>
        </a>
        <div className="nav-links">
          <a href="#/catalogo" aria-current={esCatalogo ? "page" : undefined}>Catálogo de juegos</a>
          <a href="#/" aria-current={pagina === "tienda" ? "page" : undefined}>Tienda</a>
          <a href="#/servicios" aria-current={esServicios ? "page" : undefined}>Servicios</a>
          <a className="youtube-button" href="https://www.youtube.com/@TheChipMasterWO" target="_blank" rel="noopener noreferrer" aria-label="TheChipMaster en YouTube (abre en una pestaña nueva)">
            <svg width="22" height="16" viewBox="0 0 24 18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M23 3a3 3 0 0 0-2-2C18 0 6 0 3 1a3 3 0 0 0-2 2C0 6 0 12 1 15a3 3 0 0 0 2 2c3 1 15 1 18 0a3 3 0 0 0 2-2c1-3 1-9 0-12Z" /><path d="m10 5 6 4-6 4Z" fill="#b90016" /></svg>
            YouTube <span aria-hidden="true">↗</span>
          </a>
          <button className="cart-link" onClick={() => setCarritoAbierto(true)}>Carrito <b>{carrito.reduce((s, i) => s + i.cantidad, 0)}</b></button>
        </div>
      </nav>
      <div className="hero-content">
        <p className="eyebrow">Nintendo Switch · Bogotá</p>
        <h1>{esCatalogo ? "Catálogo de juegos" : esServicios ? "Servicios TheChipMaster" : "Tienda TheChipMaster"}</h1>
        <p>{esCatalogo ? "Escoge tu combo y tu memoria, y elige los juegos para tu Switch." : esServicios ? "Instalación de chip, mantenimiento de consolas y reparación de controles." : "Encuentra consolas, controles, accesorios y repuestos en nuestra tienda."}</p>
        <a className="primary-button" href={esCatalogo ? "#arma-tu-combo" : esServicios ? "#servicios" : "#tienda"}>{esCatalogo ? "Escoge tu magia" : esServicios ? "Ver servicios" : "Explora la tienda"} <span>↓</span></a>
      </div>
      <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
    </header>

    <section className="benefits"><p>✓ Atención personalizada</p><p>✓ Pedido directo por WhatsApp</p><p>✓ Catálogo siempre actualizado</p></section>

    {esCatalogo ? <>
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
    </> : esServicios ? <section className="section store-section" id="servicios">
      <div className="section-heading"><p className="eyebrow">Servicio técnico</p><h2>Cuida tu consola y tus controles</h2><p>Selecciona un servicio y escríbenos para confirmar precio, diagnóstico y disponibilidad de atención.</p></div>
      <div className="store-filters">{categoriasServicios.map((categoria) => <button key={categoria} onClick={() => setCategoriaServicio(categoria)} aria-pressed={categoriaServicio === categoria} className={categoriaServicio === categoria ? "active" : ""}>{categoria}</button>)}</div>
      <div className="products-grid">{servicios.filter((servicio) => categoriaServicio === "Todos" || servicio.categoria === categoriaServicio).map((servicio) => <article className="product-card" key={servicio.id}>
        <div className="product-info"><span className="product-category">{servicio.categoria}</span><h3>{servicio.nombre}</h3><p>{servicio.descripcion}</p><strong className="product-price">Consultar precio</strong><a className="consult-button" href={enlaceConsulta(servicio)} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></div>
      </article>)}</div>
    </section> : <>
    <section className="section store-section" id="tienda">
      <div className="section-heading">
        <p className="eyebrow">Tienda TheChipMaster</p>
        <h2>{categoriaTienda === "Repuestos" ? "Repuestos de consolas y controles" : "Consolas, controles, accesorios y repuestos"}</h2>
        <p>
          {categoriaTienda === "Repuestos"
            ? "Encuentra piezas para tu consola o control. Consulta la compatibilidad con tu modelo antes de comprar."
            : "Encuentra consolas nuevas y de segunda mano, controles, almacenamiento, accesorios y repuestos."}
        </p>
      </div>

      <div className="store-filters">
       {categoriasTienda.map((item) => (
         <button
           key={item}
           onClick={() => setCategoriaTienda(item)}
           aria-pressed={categoriaTienda === item}
           className={categoriaTienda === item ? "active" : ""}
         >
           {item}
         </button>
      ))}
    </div>

    <div className="products-grid">
      {productosFiltrados.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onAdd={() => agregarAlCarrito(producto)}
        />
      ))}
    </div>

    {!productosFiltrados.length && (
      <div className="empty-store">
        <h3>{categoriaTienda === "Repuestos" ? "Consulta el repuesto que necesitas" : "Próximamente"}</h3>
        <p>
          {categoriaTienda === "Repuestos"
            ? "Estamos preparando el catálogo de repuestos. Escríbenos con el modelo de tu consola o control y la pieza que buscas para consultar disponibilidad y precio."
            : "Estamos actualizando nuestro inventario. Escríbenos por WhatsApp para consultar disponibilidad."}
      </p>
        <a className="primary-button" href={enlaceConsulta({
          nombre: categoriaTienda === "Repuestos" ? "un repuesto para mi consola o control" : "un producto",
        })} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a>
    </div>
   )}
 </section>


    <section className="catalog-entry section">
      <p className="eyebrow">Juegos para tu Switch</p>
      <h2>Arma tu combo de juegos</h2>
      <p>Explora los juegos disponibles y escoge tu magia y tu memoria en nuestro catálogo.</p>
      <a className="primary-button" href="#/catalogo">Ver catálogo de juegos <span>→</span></a>
    </section>
    </>}
    {esCatalogo && (combo || memoria) && <div className={`mobile-status ${juegosAlLimite || gbAlLimite ? "danger" : juegosCerca || gbCerca ? "warn" : ""}`} aria-live="polite"><span><b>{seleccionados.length} / {combo?.cantidad || 0}</b> juegos</span><span><b>{pesoTotal.toFixed(1)} / {capacidadGB || 0}</b> GB</span></div>}
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
function ProductCard({ producto, onAdd }) {
  const [imagenFallida, setImagenFallida] = useState(false);
  return (
    <article className="product-card">
      <div className="product-image">
        {producto.imagen && !imagenFallida ? (
          <img
            src={`${import.meta.env.BASE_URL}${producto.imagen.replace(/^\/+/, "")}`}
            alt={producto.nombre}
            loading="lazy"
            onError={() => setImagenFallida(true)}
          />
        ) : (
          <span role="img" aria-label="Producto sin fotografía">🎮</span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category">
          {producto.categoria}
        </span>

        <h3>{producto.nombre}</h3>

        <p className="product-condition">
          {producto.condicion}
        </p>

        <strong className="product-price">
          {producto.precio > 0
            ? dinero.format(producto.precio)
            : "Consultar precio"}
        </strong>

        {producto.precio > 0 ? (
          <button onClick={onAdd}>
            Agregar al carrito
          </button>
        ) : (
          <a
            className="consult-button"
            href={enlaceConsulta(producto)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultar por WhatsApp
          </a>
        )}
      </div>
    </article>
  );
}
function CartDrawer({ items, accesorios, total, onClose, onChange, onWhatsApp }) { return <div className="drawer-backdrop" onClick={onClose}><aside className="cart-drawer" onClick={(e) => e.stopPropagation()}><button className="close" onClick={onClose}>×</button><p className="eyebrow">Tu pedido</p><h2>Carrito</h2>{items.length ? <><div className="cart-items">{items.map((item) => <div className="cart-item" key={item.id}><div><strong>{item.nombre}</strong>{item.condicion && <small>{item.condicion}</small>}{item.detalle && <small>{item.detalle}</small>}<span>{dinero.format(item.precio * item.cantidad)}</span></div>{accesorios.some((a) => a.id === item.id) && <div className="quantity"><button onClick={() => onChange(item.id, -1)}>−</button><b>{item.cantidad}</b><button onClick={() => onChange(item.id, 1)}>+</button></div>}</div>)}</div><div className="cart-total"><span>Total</span><strong>{dinero.format(total)}</strong></div><button className="whatsapp-button" onClick={onWhatsApp}>WhatsApp Business <span>↗</span></button></> : <p className="empty">Todavía no has agregado productos.</p>}<small className="availability">El pedido queda sujeto a confirmación de disponibilidad.</small></aside></div>; }
export default App;
