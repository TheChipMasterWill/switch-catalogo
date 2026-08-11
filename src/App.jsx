import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Summary from "./components/Summary";
import GameCard from "./components/GameCard";

import juegos from "./data/juegos.json";

function App() {
  const [combo, setCombo] = useState(null);
  const [memoria, setMemoria] = useState(null);

  const [seleccionados, setSeleccionados] = useState([]);

  // Buscador
  const [busqueda, setBusqueda] = useState("");

  // Filtro por categoría
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState("Todas");

  const combos = [12, 25, 50];
  const memorias = ["128 GB", "256 GB", "512 GB", "1 TB"];

  // Convertir la capacidad seleccionada a GB
  const capacidadGB = memoria
    ? memoria === "1 TB"
      ? 1024
      : parseInt(memoria)
    : 0;

  // Peso total de los juegos seleccionados
  const pesoTotal = seleccionados.reduce(
    (total, juego) => total + juego.pesoGB,
    0
  );

  function toggleJuego(juego) {
    const existe = seleccionados.find(
      (j) => j.id === juego.id
    );

    // Si ya está seleccionado, quitarlo
    if (existe) {
      setSeleccionados(
        seleccionados.filter((j) => j.id !== juego.id)
      );
      return;
    }

    // Límite de cantidad de juegos
    if (combo && seleccionados.length >= combo) {
      alert(
        `⚠️ Has alcanzado el límite de ${combo} juegos de tu combo.`
      );
      return;
    }

    // Límite de almacenamiento
    if (
      memoria &&
      pesoTotal + juego.pesoGB > capacidadGB
    ) {
      alert(
        `⚠️ No puedes agregar "${juego.nombre}".\n\n` +
        `Tu selección quedaría en ${(pesoTotal + juego.pesoGB).toFixed(
          1
        )} GB y tu microSD es de ${memoria}.`
      );
      return;
    }

    // Agregar juego
    setSeleccionados([
      ...seleccionados,
      juego
    ]);
  }

  // Obtener categorías únicas
  const categorias = [
    "Todas",
    ...new Set(
      juegos.map((juego) => juego.categoria)
    )
  ];

  // Aplicar buscador + categoría
  const juegosFiltrados = juegos.filter((juego) => {
    const coincideBusqueda = juego.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === "Todas" ||
      juego.categoria === categoriaSeleccionada;

    return coincideBusqueda && coincideCategoria;
  });

  return (
    <div className="container">

      <Header />

      <Summary
        combo={combo}
        memoria={memoria}
        juegosSeleccionados={seleccionados.length}
        pesoTotal={pesoTotal}
      />

      <div className="card">

        <h2>Selecciona tu combo</h2>

        {combos.map((item) => (
          <button
            key={item}
            className={combo === item ? "selected" : ""}
            onClick={() => setCombo(item)}
          >
            {item} Juegos
          </button>
        ))}

      </div>

      <div className="card">

        <h2>Selecciona tu microSD</h2>

        {memorias.map((item) => (
          <button
            key={item}
            className={memoria === item ? "selected" : ""}
            onClick={() => setMemoria(item)}
          >
            {item}
          </button>
        ))}

      </div>

      <button
        className="continue"
        disabled={!combo || !memoria}
      >
        Continuar →
      </button>

      <div className="card">

        <h2>Catálogo de Juegos</h2>

        {/* BUSCADOR */}
        <input
          type="text"
          placeholder="🔍 Buscar juego..."
          value={busqueda}
          onChange={(e) =>
            setBusqueda(e.target.value)
          }
        />

        {/* FILTROS */}
        <div className="filters">

          {categorias.map((categoria) => (
            <button
              key={categoria}
              className={
                categoriaSeleccionada === categoria
                  ? "selected"
                  : ""
              }
              onClick={() =>
                setCategoriaSeleccionada(
                  categoria
                )
              }
            >
              {categoria}
            </button>
          ))}

        </div>

        <p>
          Mostrando {juegosFiltrados.length} de{" "}
          {juegos.length} juegos
        </p>

        <div className="games-grid">

          {juegosFiltrados.map((juego) => (
            <GameCard
              key={juego.id}
              juego={juego}
              seleccionado={seleccionados.some(
                (j) => j.id === juego.id
              )}
              onToggle={toggleJuego}
            />
          ))}

        </div>

      </div>

    </div>
  );
}

export default App;