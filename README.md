🌸 Gastos Próximos · Organización de pagos y deudas

<img width="1620" height="824" alt="image" src="https://github.com/user-attachments/assets/70dc562e-5702-449e-8b65-656afe139283" />


Gastos Próximos es una aplicación web minimalista e intuitiva para registrar, recordar y organizar compromisos de pago futuros, deudas pendientes y compras planificadas.

Cuenta con un sistema de acceso seguro mediante Firebase Authentication, almacenamiento individualizado para cada usuario por uid y un modo de privacidad para ocultar montos monetarios en pantalla.

✨ Funcionalidades
🔐 Cuenta de usuario
Registro con email y contraseña.

Inicio de sesión con validación de credenciales.

Cierre de sesión.

Cada usuario accede exclusivamente a su propia información.

Los registros no se comparten entre cuentas.

💰 Resumen financiero dinámico
Total pendiente: Suma acumulada de todos los compromisos que restan pagar.

Próximos 7 días: Cálculo en tiempo real de los pagos que vencen en la semana entrante.

Este mes: Total de pagos comprometidos para el mes calendario en curso.

Deudas: Acumulado monetario de todas las obligaciones clasificadas como deuda.

🧾 Gestión de registros
Cada registro puede incluir:

🏷️ Tipo: Diferenciación entre Gasto próximo (facturas, compras) o Deuda (préstamos, dinero adeudado).

📝 Descripción: Concepto detallado de la obligación.

📂 Categoría: Clasificación temática con ícono visual.

💵 Monto: Importe asignado (opcional si el valor final es variable o desconocido).

🔢 Cantidad: Unidades o ítems asociados.

📅 Fecha: Día exacto pactado o límite para realizar el pago.

📌 Nota: Aclaraciones adicionales o contexto del compromiso.

También permite:

✏️ Editar registros: Modificar cualquier campo preexistente.

✓ Marcar como pagado: Cambiar el estado y actualizar los totales pendientes al instante.

🗑️ Eliminar registros: Borrado individual con confirmación previa.

➕ Agregar registros: Formulario modal accesible desde el encabezado o la pantalla vacía.

🔍 Filtros interactivos
Permite visualizar la lista segmentada en un clic:

Todos: Listado completo ordenado cronológicamente por fecha de pago.

Pendientes: Únicamente compromisos no abonados.

Deudas: Registros catalogados formalmente como deudas.

Pagados: Historial de obligaciones ya saldadas.

👁️ Modo privacidad (Ocultar montos)
Permite enmascarar cifras con •••••• en tarjetas de resumen y en el desglose de cada gasto para visualizaciones en público o capturas de pantalla, conservando la preferencia elegida en el navegador.

🛠️ Tecnologías utilizadas
HTML5

CSS3 (Flexbox, CSS Grid y variables nativas)

JavaScript (ES6 Modules)

Firebase Authentication (v12.x)

Web Storage API (localStorage segmentado por usuario)

Git

GitHub Pages

🔥 Firebase
La aplicación utiliza Firebase Authentication para autenticar usuarios mediante correo electrónico y contraseña.

Los datos se aíslan localmente utilizando el identificador único del usuario (uid):

Plaintext
localStorage
 └── gastos_proximos_{UID}
      └── [ { id, type, description, category, amount, quantity, date, notes, paid, createdAt }, ... ]
Esto garantiza que cada cuenta conserve su lista de pendientes de forma privada e independiente.

🔒 Seguridad
La identificación del usuario está delegada íntegramente en los servidores de Firebase Authentication.

Las claves de sesión no se exponen ni se guardan en texto plano.

Cada usuario interactúa únicamente con el espacio de memoria asignado a su identificador único.

⚠️ Nunca publiques claves privadas, tokens secretos ni credenciales administrativas de Firebase en el repositorio. La configuración pública (apiKey, projectId, etc.) solo contiene identificadores de cliente para la conexión.

📁 Estructura del proyecto
Plaintext
gastos-proximos/
│
├── index.html
├── app.js
├── style.css
└── README.md
index.html
Contiene la estructura de la aplicación:

Pantalla de login y registro.

Encabezado con datos del usuario activo.

Tarjetas de resumen financiero.

Barra de herramientas y botones de filtro.

Contenedor de la lista de pendientes y estado vacío (empty state).

Ventana modal para creación y edición de registros.

app.js
Contiene la lógica de la aplicación:

Inicialización y control de Firebase Authentication.

Gestión de altas, bajas, modificaciones y estados de pago.

Algoritmos de cálculo para métricas (pendientes, 7 días, mes y deudas).

Filtros de vista y ordenamiento por fecha.

Lógica del modo de privacidad para ocultar/mostrar importes.

style.css
Contiene el diseño visual con paleta rosa, tipografía Inter, transiciones suaves y maquetación adaptable para dispositivos móviles.

🚀 Ejecutar el proyecto
Para correr el proyecto localmente:

Clonar o descargar el repositorio.

Abrir la carpeta en un editor de código como Visual Studio Code.

Ejecutar la aplicación usando un servidor local (por ejemplo, con la extensión Live Server o npx serve), ya que los módulos ES (type="module") requieren protocolo HTTP/HTTPS para resolver las importaciones de Firebase.

🌐 Publicar en GitHub Pages
Crear un repositorio en GitHub y subir los archivos:

Plaintext
index.html
app.js
style.css
README.md
Ir a Settings → Pages.

En Build and deployment, seleccionar Deploy from a branch.

Elegir la rama main y la carpeta / (root).

Hacer clic en Save para obtener el enlace público del proyecto.

🗄️ Configuración de Firebase
Para vincular un proyecto propio de Firebase:

Crear un proyecto en la consola de Firebase.

Ir a Authentication → pestaña Sign-in method.

Habilitar el proveedor Correo electrónico/contraseña.

En la configuración general del proyecto, registrar una aplicación web para obtener las credenciales y reemplazarlas dentro de firebaseConfig en app.js.

💗 Categorías disponibles
Actualmente Gastos Próximos incluye:

🏠 Hogar

💡 Servicios

🍔 Comida

🐾 Mascotas

💸 Deudas

💊 Salud

🚗 Transporte

📦 Otros

🎯 Objetivo del proyecto
Brindar una herramienta clara, visual y rápida para responder las preguntas esenciales sobre los compromisos del mes:

¿Qué tengo que pagar en los próximos días, cuánto debo en total y qué cuentas ya quedaron saldadas?

🔮 Próximas mejoras
☁️ Sincronización directa en la nube con Cloud Firestore.

🔔 Notificaciones push para vencimientos inminentes.

📊 Gráficos de distribución del gasto por categoría.

📥 Exportación de pendientes a formato PDF y hoja de cálculo.

💳 Seguimiento de cuotas restantes por compra.

# 💗 MENSUALES — Control de Presupuesto & Finanzas Personales

Aplicación web progresiva e intuitiva diseñada para el seguimiento mensual de gastos personales, presupuestos, proyecciones y análisis de hábitos financieros.

---

## 🚀 Novedades: Ecosistema Integrado con "Gastos Próximos" 🌸

Se integró **MENSUALES** con la aplicación complementaria **[Gastos Próximos](https://gastos-proximos.vercel.app/)** (agenda de vencimientos, pagos a realizar y deudas), creando un flujo financiero unificado bajo el mismo proyecto de Firebase.

### 🔗 Acceso Rápido entre Aplicaciones
* Se añadió un **botón directo de navegación en la cabecera** de ambas aplicaciones que permite alternar entre **MENSUALES** y **Gastos Próximos** al instante y en la misma pestaña, sin abrir ventanas adicionales ni perder contexto.

---

## 📄 Exportación de Reportes en PDF (Ambas Apps)

<img width="893" height="270" alt="image" src="https://github.com/user-attachments/assets/9b9565f4-4a01-4f19-87fb-be5f92a8d8fe" />

<img width="970" height="187" alt="image" src="https://github.com/user-attachments/assets/b5c54ad4-961f-4d1e-853e-2e38684e9843" />



Ambas plataformas cuentan con generación instantánea de balances descargables en formato PDF mediante la librería **jsPDF**, manteniendo una identidad visual armónica:

* **En MENSUALES:** Genera el balance contable mensual comparativo con respecto al mes anterior, distribución por categorías y análisis de tendencias.
* **En Gastos Próximos:** Se incorporó el botón **`📄 PDF`** en la barra superior para exportar un reporte con:
  * Tarjetas de resumen: **Total Pendiente**, **Total en Deudas** y cantidad de ítems pendientes.
  * Tabla cronológica detallada con fecha, concepto, categoría, estado y monto a pagar.
  * Cálculo del total final de compromisos pendientes para llevar un control impreso o archivarlo digitalmente.

---

## 🔄 Flujo de Sincronización Bidireccional en Tiempo Real

Ambas aplicaciones comparten la misma base de datos en **Cloud Firestore** y el mismo sistema de credenciales en **Firebase Authentication**. Esto habilita una sincronización inteligente y automática:




👩‍💻 Autora
Florencia Bagnis

💼 LinkedIn: https://www.linkedin.com/in/florencia-bagnis-5043aa152/

💻 Portfolio: https://florbagnis.github.io/Portfolio-FlorBagnis/

📧 Email: florenciasoledadbagnis@gmail.com

💗 Gastos Próximos
Todo lo que tengo que pagar, recordar o debo.
