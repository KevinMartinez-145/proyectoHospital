# 🏥 Proyecto Hospital - Gestión Clínica Web ✨

Aplicación web para la gestión de pacientes, doctores, enfermeras, citas, tratamientos, medicamentos y departamentos en un entorno clínico.

## 🔧 Stack Tecnológico

- **Core:** React 19+, TypeScript, Vite  
- **UI:** Tailwind CSS, Shadcn/ui, Lucide Icons  
- **Routing:** React Router DOM v7  
- **Estado:** Zustand (Cliente Global), Tanstack Query (Servidor)  
- **Formularios:** React Hook Form, Zod (Validación)  
- **API:** Axios  
- **Linting:** ESLint  

## 📁 Estructura del Proyecto

kevinmartinez-145-proyectohospital/
├── README.md
├── components.json              # Configuración Shadcn/ui
├── package.json                # Dependencias y scripts
├── tailwind.config.js         # Configuración Tailwind
├── tsconfig.json              # Configuración TypeScript
├── vite.config.ts             # Configuración Vite
├── public/                    # Archivos estáticos
└── src/                       # Código fuente de la aplicación
    ├── App.tsx                # Componente principal y rutas
    ├── main.tsx               # Punto de entrada de React
    ├── components/            # UI reutilizable (common, forms, layouts, ui)
    ├── hooks/                 # Hooks personalizados (datos, auth, toast)
    ├── lib/                   # Utilidades core (apiClient, utils)
    ├── pages/                 # Componentes de página (list, form, login, etc.)
    ├── schemas/               # Esquemas de validación Zod
    ├── services/              # Funciones de interacción API
    ├── stores/                # Estado global Zustand (auth)
    └── types/                 # Definiciones de tipos TypeScript



*(Usa el alias `@/*` para `src/*`)*

## ⚙️ Primeros Pasos

### Prerrequisitos

- Node.js (v18+)  
- npm  
- **API Backend Corriendo:** Asegúrate de que el servicio backend esté en ejecución (por defecto apunta a `http://localhost:3000`).  

### Instalación y Configuración

1. **Clonar:**
    ```bash
    git clone https://github.com/KevinMartinez-145/kevinmartinez-145-proyectohospital.git
    cd kevinmartinez-145-proyectohospital
    ```

2. **Instalar Dependencias:**  
   *(Nota: `--force` podría ser necesario debido a posibles conflictos menores, ej., con pre-releases de Tailwind v4 si se usan indirectamente)*  
    ```bash
    npm install --force
    ```

3. **Ejecutar Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```
    Accede vía `http://localhost:5173` (o como indique Vite).

## 🚀 Otros Comandos

- **Compilar para Producción:**
    ```bash
    npm run build
    ```
    (Salida en `dist/`)

- **Verificar Código (Lint):**
    ```bash
    npm run lint
    ```

---
