# To-do-list
📌 To-Do List Pro - Gestor de Tareas Avanzado
Desarrollado por diego
Aplicación web para organizar tus tareas diarias con estilo y funcionalidades premium

✨ Lo que hace especial esta app
He creado esta To-Do List con múltiples funcionalidades que no encontrarás en aplicaciones similares:

✅ Prioridades inteligentes

Clasifica tus tareas con colores (rojo/amarillo/verde)

Filtra por urgencia cuando tienes muchas pendientes

🔄 Reorganización intuitiva

Arrastra y suelta las tareas para cambiar su orden

Ideal para cuando cambian tus prioridades

🌓 Modo oscuro profesional

Diseñé personalmente una paleta de colores que no cansa la vista

Guarda tu preferencia automáticamente

🔍 Búsqueda instantánea

Encuentra cualquier tarea en milisegundos

Funciona incluso con palabras parciales

🛠 Tecnologías usadas
Frontend	Librerías	Extras
HTML5	SortableJS	PWA
CSS3	FontAwesome	Responsive
JavaScript	-	LocalStorage
🚀 Cómo probarlo
Opción rápida (online):
▶️ Demo en vivo en GitHub Pages

Localmente:

bash
git clone https://github.com/tuusuario/todo-list-pro.git
cd todo-list-pro
python -m http.server 8000
Abre tu navegador en http://localhost:8000

🧑‍💻 Para desarrolladores
Estructura del código
markdown
/  
├── index.html        # Estructura principal  
├── style.css         # Estilos personalizados  
├── script.js         # Lógica de la aplicación  
├── manifest.json     # Config PWA  
└── assets/           # Iconos e imágenes  
Características técnicas destacables:
javascript
// Ejemplo de mi implementación del Drag & Drop
const sortable = new Sortable(todoList, {
    animation: 150,
    onEnd: function() {
        // Lógica personalizada para reordenamiento
        updateTaskOrder(); 
    }
});
📝 Por qué este proyecto
Desarrollé esta aplicación porque:

Quería crear una herramienta realmente útil para mi flujo de trabajo diario

Las apps existentes tenían demasiadas distracciones o funciones innecesarias

Demostrar mi capacidad para crear soluciones completas desde cero

🛠️ ¡Próximas características!

Sincronización entre dispositivos

Recordatorios programables

Soporte para categorías
