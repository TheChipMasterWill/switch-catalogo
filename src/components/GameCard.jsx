function GameCard({
  juego,
  seleccionado,
  onToggle,
  bloqueado,
  motivoBloqueo,
}) {
  return (
    <div
      className={
        seleccionado
          ? "game-card selected-card"
          : "game-card"
      }
    >
      <img
        src={`${import.meta.env.BASE_URL}${juego.imagen.replace(/^\//, "")}`}
        alt={juego.nombre}
      />

      <h3>{juego.nombre}</h3>

      <p>💾 {juego.pesoGB} GB</p>

      <span>{juego.categoria}</span>

      <button
        className={
          seleccionado
            ? "selected-game"
            : ""
        }
        onClick={() => onToggle(juego)}
        disabled={bloqueado}
      >
        {seleccionado
          ? "✓ Agregado"
          : bloqueado
            ? "Sin espacio"
            : "Agregar"}
      </button>

      {bloqueado && motivoBloqueo && (
        <small className="blocked-message">
          {motivoBloqueo}
        </small>
      )}
    </div>
  );
}

export default GameCard;