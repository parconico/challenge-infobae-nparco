# Challenge Infobae - Nicolás Parco

Este proyecto es una aplicación web moderna desarrollada con Next.js 15, React 19 y TypeScript, utilizando las últimas tecnologías y mejores prácticas de desarrollo.

## Tecnologías Principales

- Next.js 15.3.3 con Turbopack
- React 19.0.0
- TypeScript 5
- Tailwind CSS 4
- Shadcn para componentes accesibles
- Zustand para manejo de estado
- AI SDK para integraciones con OpenAI

## Requisitos Previos

- Node.js (versión 20 o superior recomendada)
- npm o yarn

## Configuración del Proyecto

1. Clonar el repositorio:

```bash
git clone https://github.com/parconico/challenge-infobae-nparco.git
cd challenge-infobae-nparco
```

2. Instalar dependencias:

```bash
npm install
# o
yarn install
```

3. Iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

## Configuración del Entorno (.env)

Para que la aplicación funcione correctamente, es necesario crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables de entorno:

```env
# Exa API Key
EXA_API_KEY=

# Exa URL API
EXA_API_URL="https://api.exa.ai/search"

# OpenAI API Key
OPENAI_API_KEY=

# URL de la aplicación Next.js (entorno de desarrollo)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Opcional: Configuraciones personalizadas del modelo
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=4000
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter para verificar el código

## Características Principales

- 🚀 Rendimiento optimizado con Turbopack
- 🎨 Diseño moderno y responsive con Tailwind CSS
- 🔒 Componentes accesibles con Shadcn
- 🌙 Soporte para tema claro/oscuro con next-themes
- 📄 Generación de PDFs con jsPDF
- 🤖 Integración con IA mediante OpenAI SDK

## Modelos de OpenAI utilizados

Durante el desarrollo del proyecto se han utilizado y probado los siguientes modelos de la API de OpenAI:

- `gpt-3.5-turbo`
- `gpt-4o`
- `gpt-4o-mini`

Esto permitió validar la flexibilidad del sistema ante distintos niveles de costo y capacidad de respuesta de los modelos.

## Enfoques que se tuvieron en cuenta

- Desarrollo de una interfaz intuitiva y simple que te impulsa a una serie de pasos.
- Utilizacion de la API Exa para obtener informacion relevante de cada tema predefinido.
- Se tuvieron en cuenta criterios programaticos y heuristicos para la categorizacion del contenido.
- Generacion de articulos a partir de URL utilizando useChat() y streamText().
- Generacion de titulos dinamicos utilizando hook generateObject().
- Features opcionales implementadas.

## Consideraciones Técnicas

- Se utiliza TypeScript para type safety
- Implementación de ESLint para mantener la calidad del código
- Uso de Tailwind CSS para estilos consistentes y mantenibles
- Componentes accesibles siguiendo las mejores prácticas

## Próximas Mejoras

- [ ] Implementar tests unitarios y de integración
- [ ] Mejorar la cobertura de tipos de TypeScript
- [ ] Añadir documentación detallada de componentes
- [ ] Implementar CI/CD

## Contacto

Nicolás Parco

- GitHub: https://github.com/parconico
- LinkedIn: https://www.linkedin.com/in/nicolas-parco-164b89181/
- Email: nicoparco98@gmail.com

```

```
