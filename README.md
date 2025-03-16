# Proyecto Web - React + TypeScript + Vite

## Descripción
Este proyecto es una aplicación web desarrollada con React, TypeScript y Vite. La estructura del proyecto sigue buenas prácticas para el desarrollo modular y escalable.

## Tecnologías utilizadas
- **React**: Librería para la construcción de interfaces de usuario.
- **TypeScript**: Lenguaje de programación tipado que mejora la calidad del código.
- **Vite**: Herramienta de construcción rápida y eficiente.

## Estructura del proyecto
```
├── src
│   ├── componentes/  # Componentes reutilizables
│   ├── paginas/      # Páginas principales
│   ├── utilidades/   # Funciones y helpers
│   ├── main.tsx      # Punto de entrada principal
│   ├── App.tsx       # Componente principal
│
├── public/           # Archivos estáticos
├── package.json      # Configuración de dependencias
├── tsconfig.json     # Configuración de TypeScript
├── vite.config.ts    # Configuración de Vite
```

## Instalación y Ejecución
1. Clonar el repositorio:
   ```sh
   git clone https://github.com/KevinMartinez-145/proyectoHospital.git
   cd proyectoHospital
   ```
2. Instalar dependencias:
   ```sh
   npm install
   ```
3. Ejecutar el servidor de desarrollo:
   ```sh
   npm run dev
   ```

## Configuración de ESLint
Este proyecto incluye una configuración básica de ESLint para mantener un código limpio y consistente. Si deseas expandir la configuración, puedes habilitar reglas adicionales en `eslint.config.js`.

