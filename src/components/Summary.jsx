function Summary({
  combo,
  memoria,
  juegosSeleccionados,
  pesoTotal
}) {

  // Convertir la capacidad de la microSD a GB
  const capacidadGB = memoria
    ? memoria === "1 TB"
      ? 1024
      : parseInt(memoria)
    : 0;

  // Porcentaje de juegos seleccionados
  const porcentajeJuegos = combo
    ? Math.min((juegosSeleccionados / combo) * 100, 100)
    : 0;

  // Porcentaje de almacenamiento utilizado
  const porcentajeGB = capacidadGB
    ? Math.min((pesoTotal / capacidadGB) * 100, 100)
    : 0;

  return (
    <div className="card">

      <h2>📦 Mi Combo</h2>

      <p>
        <strong>Combo:</strong>{" "}
        {combo ? `${combo} Juegos` : "-"}
      </p>

      <p>
        <strong>MicroSD:</strong>{" "}
        {memoria ?? "-"}
      </p>

      <div className="progress-section">

        <p>
          <strong>
            {juegosSeleccionados} / {combo ?? 0} juegos
          </strong>
        </p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${porcentajeJuegos}%`
            }}
          ></div>
        </div>

        <p className="progress-percent">
          {porcentajeJuegos.toFixed(0)}%
        </p>

      </div>

      <div className="progress-section">

        <p>
          <strong>
            {pesoTotal.toFixed(1)} GB / {capacidadGB || 0} GB
          </strong>
        </p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${porcentajeGB}%`
            }}
          ></div>
        </div>

        <p className="progress-percent">
          {porcentajeGB.toFixed(0)}%
        </p>

      </div>

    </div>
  );
}

export default Summary;