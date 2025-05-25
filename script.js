// Función para cargar el archivo JSON de criaturas
async function cargarCriaturas() {
  const respuesta = await fetch("criaturas.json");
  const criaturas = await respuesta.json();
  return criaturas;
}

// Función para obtener el día actual en español
function obtenerDiaActual() {
  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  const ahora = new Date();
  return dias[ahora.getDay()];
}

// Función para obtener los minutos actuales del día
function obtenerMinutosActuales() {
  const ahora = new Date();
  return ahora.getHours() * 60 + ahora.getMinutes();
}

// Función para verificar si una criatura está activa en el momento actual
function estaActivaAhora(criatura, diaActual, minutosActuales) {
  const horarios = criatura.apariciones[diaActual];

  // Si no hay horarios definidos, la criatura no está activa
  if (!horarios) return false;

  // Verificar si la criatura tiene horarios definidos para el día actual
  return horarios.some((horario) => {
    const [inicio, fin] = horario.split("-");
    const [hIni, mIni] = inicio.split(":").map(Number);
    const [hFin, mFin] = fin.split(":").map(Number);
    const minInicio = hIni * 60 + mIni;
    const minFin = hFin * 60 + mFin;

    // Si el horario de fin es menor que el de inicio, significa que abarca la medianoche
    return minutosActuales >= minInicio && minutosActuales <= minFin;
  });
}

// Función para mostrar las criaturas activas en el momento actual y actualizar la lista cada minuto
async function mostrarActivas() {
  const criaturas = await cargarCriaturas();
  const lista = document.getElementById("lista-criaturas");
  lista.innerHTML = "";

  // Obtener el día actual y los minutos actuales

  const diaActual = obtenerDiaActual();
  const minutosActuales = obtenerMinutosActuales();

  // Filtrar las criaturas activas

  const activas = criaturas.filter((c) =>
    estaActivaAhora(c, diaActual, minutosActuales)
  );

  if (activas.length === 0) {
    lista.innerHTML = "<li>No hay criaturas activas ahora.</li>";
  } else {
    activas.forEach((c) => {
      const div = document.createElement("div");
      div.className = "criatura";

      // Crear un elemento de imagen y un párrafo para cada criatura activa

      // Convertir el nombre de la criatura a un slug para la imagen y el alt
      const slug = c.nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // elimina acentos
        .replace(/[^a-z0-9 ]/g, "") // elimina símbolos
        .replace(/\s+/g, "-"); // reemplaza espacios por guiones

      const img = document.createElement("img");
      img.src = `imagenes/${slug}.png`;
      img.alt = c.nombre;

      const p = document.createElement("p");
      p.textContent = c.nombre;

      div.appendChild(img);
      div.appendChild(p);
      lista.appendChild(div);
    });
  }
}

// Llamar a la función para mostrar criaturas activas al cargar la página

mostrarActivas();
setInterval(mostrarActivas, 60000); // actualiza cada minuto
