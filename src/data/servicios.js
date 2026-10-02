// Edita aquí los servicios ofrecidos. Las cotizaciones se confirman por WhatsApp.
export const servicios = [
  { id: "chip-switch", nombre: "Instalación de chip para Nintendo Switch", categoria: "Instalación de chip", descripcion: "Servicio para Nintendo Switch normal, OLED y Lite. Consulta instalación y configuración." },
  ...["Xbox 360", "Xbox One", "Xbox Series S", "Xbox Series X", "PS3", "PS4", "PS5"].flatMap((consola) => {
    const id = consola.toLowerCase().replaceAll(" ", "-");
    return [
      { id: `mantenimiento-${id}`, nombre: `Mantenimiento de ${consola}`, categoria: "Mantenimiento de consolas", descripcion: "Cuéntanos el estado de tu consola para consultar el mantenimiento y su precio." },
      { id: `control-${id}`, nombre: `Reparación de controles de ${consola}`, categoria: "Reparación de controles", descripcion: "Indícanos el modelo de tu control y la falla para consultar diagnóstico y reparación." },
    ];
  }),
];
export const categoriasServicios = ["Todos", ...new Set(servicios.map((servicio) => servicio.categoria))];
