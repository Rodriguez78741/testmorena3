////Seccion de Recordatorios

const marco = document.getElementById("marco");
const btnAgregarNotas = document.getElementById("btnAgregarNotas");
const agregarNotasModal = new bootstrap.Modal(document.getElementById("agregarNotasModal"));
const notasForm = document.getElementById("notasForm");

// Guardar notas en LocalStorage
const guardarNotasEnLocalStorage = () => {
    const notas = [...marco.querySelectorAll(".nota")].map(nota => ({
        title: nota.querySelector(".titulo").innerText,
        description: nota.querySelector(".descripcion").innerText,
        backgroundColor: nota.style.backgroundColor,
        pinColor: nota.querySelector(".pin").style.backgroundColor,
    }));
    localStorage.setItem("stickyNotas", JSON.stringify(notas));
};

// Cargar notas desde LocalStorage
const cargarNotasDeLocalStorage = () => {
    const notasGuardadas = JSON.parse(localStorage.getItem("stickyNotas")) || [];
    notasGuardadas.forEach(notaData => {
        crearNota(notaData.title, notaData.description, notaData.backgroundColor, notaData.pinColor);
    });
};

// Crear una nueva nota
const crearNota = (titulo, descripcion, backgroundColor, pinColor) => {
    const nuevaNota = document.createElement("div");
    nuevaNota.className = "nota";
    nuevaNota.style.backgroundColor = backgroundColor;
    nuevaNota.innerHTML = `
        <div class="pin" style="background-color: ${pinColor};"></div>
        <div class="text">
            <h5 class="titulo">${titulo}</h5>
            <p class="descripcion">${descripcion}</p>
        </div>
        <button class="delete-note btn btn-sm btn-danger">Eliminar</button>
    `;
    nuevaNota.querySelector(".delete-note").addEventListener("click", () => {
        nuevaNota.remove();
        guardarNotasEnLocalStorage();
    });
    marco.appendChild(nuevaNota);
    guardarNotasEnLocalStorage();
};

// Manejar el formulario de agregar nota
notasForm.addEventListener("submit", e => {
    e.preventDefault();
    const titulo = document.getElementById("notaTitulo").value;
    const descripcion = document.getElementById("notaDescripcion").value;
    const backgroundColor = document.getElementById("notaColor").value;
    const pinColor = document.getElementById("pinColor").value;

    crearNota(titulo, descripcion, backgroundColor, pinColor);
    agregarNotasModal.hide();
    notasForm.reset();
});

// Cargar notas al iniciar
document.addEventListener("DOMContentLoaded", cargarNotasDeLocalStorage);


///// Sección Calificaciones

// Referencias a los elementos de la interfaz
const calificacionesCuerpo = document.getElementById('calificacionesCuerpo');
const promedioFinal = document.getElementById('promedioFinal');
const btnGuardarCalificacion = document.getElementById('btnGuardarCalificacion');
const materia = document.getElementById('materia');
const notaParcial1 = document.getElementById('notaParcial1');
const notaParcial2 = document.getElementById('notaParcial2');
const notaFinal = document.getElementById('notaFinal');
const calificacionesModal = new bootstrap.Modal(document.getElementById('calificacionesModal'));

// Función para cargar calificaciones desde localStorage
function cargarCalificacionesDeLocalStorage() {
    const calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || [];
    calificacionesCuerpo.innerHTML = '';
    let totalFinales = 0;
    let countFinales = 0;

    calificaciones.forEach((calificacion, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${calificacion.materia}</td>
            <td contenteditable="true" oninput="updateNota(${index}, 'notaParcial1', this.innerText)">${calificacion.notaParcial1 || ''}</td>
            <td contenteditable="true" oninput="updateNota(${index}, 'notaParcial2', this.innerText)">${calificacion.notaParcial2 || ''}</td>
            <td contenteditable="true" oninput="updateNota(${index}, 'notaFinal', this.innerText)">${calificacion.notaFinal || ''}</td>
            <td><button class="btn btn-danger btn-sm" onclick="eliminarCalificacion(${index})">Eliminar</button></td>
        `;
        calificacionesCuerpo.appendChild(row);

        if (calificacion.notaFinal) {
            totalFinales += parseFloat(calificacion.notaFinal);
            countFinales++;
        }
    });

    // Calcular el promedio
    promedioFinal.textContent = countFinales > 0 ? (totalFinales / countFinales).toFixed(2) : '0.00';
}

// Guardar una nueva calificación
btnGuardarCalificacion.addEventListener('click', () => {
    const materiaValue = materia.value.trim();
    const notaParcial1Value = notaParcial1.value || '';
    const notaParcial2Value = notaParcial2.value || '';
    const notaFinalValue = notaFinal.value || '';

    if (!materiaValue) {
        alert('Por favor, ingrese una materia.');
        return;
    }

    const calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || [];
    calificaciones.push({ materia: materiaValue, notaParcial1: notaParcial1Value, notaParcial2: notaParcial2Value, notaFinal: notaFinalValue });
    localStorage.setItem('calificaciones', JSON.stringify(calificaciones));

    cargarCalificacionesDeLocalStorage();
    calificacionesModal.hide();

    // Limpiar los campos del formulario
    materia.value = '';
    notaParcial1.value = '';
    notaParcial2.value = '';
    notaFinal.value = '';
});

// Actualizar una calificación existente
function updateNota(index, key, value) {
    const calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || [];
    if (key === 'notaParcial1' || key === 'notaParcial2' || key === 'notaFinal') {
        calificaciones[index][key] = value;
        localStorage.setItem('calificaciones', JSON.stringify(calificaciones));
        cargarCalificacionesDeLocalStorage();
    }
}

// Eliminar una calificación
function eliminarCalificacion(index) {
    const calificaciones = JSON.parse(localStorage.getItem('calificaciones')) || [];
    calificaciones.splice(index, 1);
    localStorage.setItem('calificaciones', JSON.stringify(calificaciones));
    cargarCalificacionesDeLocalStorage();
}

// Cargar las calificaciones al cargar la página
document.addEventListener('DOMContentLoaded', cargarCalificacionesDeLocalStorage);


////////Seccion Footer

document.getElementById('infoLink').addEventListener('click', function(event) {
    event.preventDefault(); // Evitar la navegación

    // Usamos fetch para obtener el archivo de texto
    fetch('/documentos/datos.txt')
        .then(response => response.text())
        .then(data => {
            // Colocamos el contenido del archivo en el modal
            document.getElementById('txtData').textContent = data;
        })
        .catch(error => {
            // Si ocurre un error al cargar el archivo
            document.getElementById('txtData').textContent = "No se pudo cargar la información.";
        });
});










