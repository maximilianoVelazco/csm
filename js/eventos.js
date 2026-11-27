
const calendario = document.getElementById("calendario");
const tituloMes = document.getElementById("mes-actual");
const botonAnterior = document.getElementById("mes-anterior");
const botonSiguiente = document.getElementById("mes-siguiente");
const listaEventos = document.getElementById("lista-eventos");

const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

let mesActual = hoy.getMonth();
let anioActual = hoy.getFullYear();

const nombresMeses = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Eventos ficticios para probar la agenda
const eventos = [
  {
    fecha: "2026-11-18",
    titulo: "Reunión abierta del comité",
    categoria: "Reuniones",
    hora: "18:30",
    descripcion: "Encuentro abierto para debatir y organizar las próximas actividades."
  },
  {
    fecha: "2026-11-20",
    titulo: "Jornada de difusión",
    categoria: "Actividades institucionales",
    hora: "17:00",
    descripcion: "Actividad de difusión y conversación con vecinos."
  },
  {
    fecha: "2026-11-24",
    titulo: "Encuentro de formación política",
    categoria: "Eventos",
    hora: "19:00",
    descripcion: "Espacio de intercambio y formación."
  },
  {
    fecha: "2026-11-28",
    titulo: "Reunión de organización",
    categoria: "Reuniones",
    hora: "16:00",
    descripcion: "Coordinación de las próximas tareas del comité."
  },
  {
    fecha: "2026-12-03",
    titulo: "Día Internacional de las Personas con Discapacidad",
    categoria: "Fechas importantes",
    hora: "",
    descripcion: "Fecha de conmemoración y reflexión."
  }
];

function formatoFecha(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function crearDia(numero, fecha, esOtroMes = false) {
  const dia = document.createElement("div");
  dia.classList.add("dia-calendario");

  if (esOtroMes) {
    dia.classList.add("otro-mes");
  }

  if (formatoFecha(fecha) === formatoFecha(hoy)) {
    dia.classList.add("hoy");
  }

  dia.textContent = numero;

  const eventosDelDia = eventos.filter(
    evento => evento.fecha === formatoFecha(fecha)
  );

  if (eventosDelDia.length > 0) {
    dia.classList.add("tiene-eventos");

    const indicador = document.createElement("span");
    indicador.classList.add("indicador-eventos");
    indicador.textContent = "●".repeat(eventosDelDia.length);

    dia.appendChild(indicador);
    dia.title = eventosDelDia.map(evento => evento.titulo).join(", ");
  }

  return dia;
}

function generarCalendario() {
  calendario.innerHTML = "";

  tituloMes.textContent =
    nombresMeses[mesActual] + " " + anioActual;

  const diasSemana = [
    "Lunes", "Martes", "Miércoles",
    "Jueves", "Viernes", "Sábado", "Domingo"
  ];

  diasSemana.forEach(nombre => {
    const encabezado = document.createElement("div");
    encabezado.classList.add("dia-semana");
    encabezado.textContent = nombre;
    calendario.appendChild(encabezado);
  });

  const primerDia = new Date(anioActual, mesActual, 1);
  const ultimoDia = new Date(anioActual, mesActual + 1, 0);

  let diaInicio = primerDia.getDay();
  diaInicio = (diaInicio + 6) % 7;

  const cantidadDias = ultimoDia.getDate();
  const ultimoDiaAnterior = new Date(anioActual, mesActual, 0).getDate();

  // Días del mes anterior
  for (let i = diaInicio - 1; i >= 0; i--) {
    const numero = ultimoDiaAnterior - i;
    const fecha = new Date(anioActual, mesActual - 1, numero);

    calendario.appendChild(crearDia(numero, fecha, true));
  }

  // Días del mes actual
  for (let numero = 1; numero <= cantidadDias; numero++) {
    const fecha = new Date(anioActual, mesActual, numero);

    calendario.appendChild(crearDia(numero, fecha));
  }

  // Días del mes siguiente para completar la última semana
  const diasRestantes = (7 - (calendario.children.length % 7)) % 7;

  for (let numero = 1; numero <= diasRestantes; numero++) {
    const fecha = new Date(anioActual, mesActual + 1, numero);

    calendario.appendChild(crearDia(numero, fecha, true));
  }
}

function mostrarProximosEventos() {
  listaEventos.innerHTML = "";

  const proximos = eventos
    .filter(evento => {
      const fechaEvento = new Date(evento.fecha + "T00:00:00");
      return fechaEvento >= hoy;
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  if (proximos.length === 0) {
    listaEventos.textContent = "No hay actividades próximas programadas.";
    return;
  }

  proximos.forEach(evento => {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("evento-proximo");

    const fecha = new Date(evento.fecha + "T00:00:00");
    const fechaTexto = fecha.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const titulo = document.createElement("h3");
    titulo.textContent = evento.titulo;

    const categoria = document.createElement("p");
    categoria.textContent = evento.categoria;

    const fechaHora = document.createElement("p");
    fechaHora.textContent =
      fechaTexto + (evento.hora ? " · " + evento.hora : "");

    const descripcion = document.createElement("p");
    descripcion.textContent = evento.descripcion;

    tarjeta.append(titulo, categoria, fechaHora, descripcion);
    listaEventos.appendChild(tarjeta);
  });
}

botonAnterior.addEventListener("click", () => {
  mesActual--;

  if (mesActual < 0) {
    mesActual = 11;
    anioActual--;
  }

  generarCalendario();
});

botonSiguiente.addEventListener("click", () => {
  mesActual++;

  if (mesActual > 11) {
    mesActual = 0;
    anioActual++;
  }

  generarCalendario();
});

generarCalendario();
mostrarProximosEventos();
