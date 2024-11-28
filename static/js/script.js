document.addEventListener("DOMContentLoaded", () => {
    const asciiContainer = document.getElementById("ascii-container");
    let grid = []; // Matriz que representa la cuadrícula
    const defaultChar = "."; // Carácter inicial para la cuadrícula
    let resetTimeout; // Temporizador para restaurar la cuadrícula

    // Crear la cuadrícula inicial
    function createAsciiGrid() {
        const cols = Math.floor(window.innerWidth / 6);
        const rows = Math.floor(window.innerHeight / 6);

        grid = [];
        asciiContainer.innerHTML = "";

        for (let y = 0; y < rows; y++) {
            const row = [];
            for (let x = 0; x < cols; x++) {
                const span = document.createElement("span");
                span.textContent = defaultChar;
                span.classList.add("character");
                span.dataset.x = x;
                span.dataset.y = y;

                // Cambiar a asteriscos al pasar el mouse
                span.addEventListener("mouseover", () => {
                    span.textContent = "*";
                    setTimeout(() => {
                        span.textContent = defaultChar;
                    }, 300);
                });

                // Mostrar imagen ASCII al hacer clic
                span.addEventListener("click", () => {
                    const x = parseInt(span.dataset.x);
                    const y = parseInt(span.dataset.y);
                    fetchAsciiImage(x, y);
                });

                asciiContainer.appendChild(span);
                row.push(span);
            }
            grid.push(row);
        }
    }

    // Restaurar la cuadrícula al estado inicial
    function resetGrid() {
        grid.forEach(row => {
            row.forEach(span => {
                span.textContent = defaultChar;
            });
        });
    }

    // Mostrar imagen ASCII en la cuadrícula
    function renderAsciiImage(x, y, cad, width, height) {
        const asciiRows = cad.split("\n");
        const halfWidth = Math.floor(width / 2);
        const halfHeight = Math.floor(height / 2);

        // Superponer la imagen ASCII en la cuadrícula
        for (let row = 0; row < asciiRows.length; row++) {
            for (let col = 0; col < asciiRows[row].length; col++) {
                const gridX = x + col - halfWidth;
                const gridY = y + row - halfHeight;

                // Validar los límites de la cuadrícula
                if (grid[gridY] && grid[gridY][gridX]) {
                    const span = grid[gridY][gridX];
                    span.textContent = asciiRows[row][col];
                }
            }
        }

        // Reiniciar la cuadrícula después de 1.5 segundos
        clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => {
            resetGrid();
        }, 1500);
    }

    // Obtener la imagen ASCII desde el servidor
    async function fetchAsciiImage(centerX, centerY) {
        try {
            const response = await fetch("/get-dimensions");
            if (response.ok) {
                const data = await response.json();
                if (data.error) {
                    console.error("Error del servidor:", data.error);
                    return;
                }
                renderAsciiImage(centerX, centerY, data.cad, data.width, data.height);
            } else {
                console.error("Error al obtener la imagen ASCII");
            }
        } catch (err) {
            console.error("Error al comunicarse con el servidor:", err);
        }
    }

    // Crear la cuadrícula inicial
    createAsciiGrid();

    // Recalcular la cuadrícula al redimensionar la ventana
    window.addEventListener("resize", () => createAsciiGrid());
});
