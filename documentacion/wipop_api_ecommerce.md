# 📚 Manual de integración con API eCommerce Wipop

> Esta guía describe la API REST de Wipop para integrar métodos de pago en entornos de comercio electrónico. Está pensada para perfiles técnicos y de negocio, cubriendo el ciclo completo: creación de cargos, devoluciones, anulaciones, confirmaciones de preautorizaciones y pagos recurrentes. Incluye ejemplos con tarjeta, Bizum y tokenización (pagos en 1 clic y recurrentes).  
> 💡 **Consejo**: mantén a mano tus claves de *sandbox* y configura `Idempotency-Key` en todas las operaciones críticas.

---

## 📑 Índice

1. [🧠 Conceptos clave](#-conceptos-clave)  
2. [👥 Roles y responsabilidades](#-roles-y-responsabilidades)  
3. [🌐 Entornos y credenciales](#-entornos-y-credenciales)  
4. [🔐 Autenticación y seguridad](#-autenticación-y-seguridad)  
5. [🏷️ Versionado de API](#️-versionado-de-api)  
6. [🔄 Tipos de operaciones](#-tipos-de-operaciones)  
   6.1. [💳 Autorizaciones (compra directa)](#-autorizaciones-compra-directa)  
   6.2. [🕒 Preautorizaciones y confirmaciones](#-preautorizaciones-y-confirmaciones)  
   6.3. [↩️ Devoluciones](#️-devoluciones)  
   6.4. [🛑 Anulaciones](#-anulaciones)  
   6.5. [🧷 Tokenización y pagos recurrentes](#-tokenización-y-pagos-recurrentes)  
7. [📲 Flujos Bizum](#-flujos-bizum)  
8. [🔔 Webhooks](#-webhooks)  
9. [🧩 Modelos principales](#-modelos-principales)  
   9.1. [📦 Objeto `charge`](#-objeto-charge)  
   9.2. [💸 Objeto `refund`](#-objeto-refund)  
   9.3. [🧾 Objeto `checkout`](#-objeto-checkout)  
   9.4. [🔖 Objeto `token`](#-objeto-token)  
10. [🧭 Endpoints principales](#-endpoints-principales)  
   10.1. [⚡ Autorización directa con tarjeta (cargo inmediato)](#-autorización-directa-con-tarjeta-cargo-inmediato)  
   10.2. [⚡ Compra directa con Bizum](#-compra-directa-con-bizum)  
   10.3. [🪜 Preautorización con tarjeta (dos pasos)](#-preautorización-con-tarjeta-dos-pasos)  
   10.4. [📥 Confirmación de preautorización (captura)](#-confirmación-de-preautorización-captura)  
   10.5. [↩️ Devolución (total o parcial)](#️-devolución-total-o-parcial)  
   10.6. [🛑 Anulación de operación](#-anulación-de-operación)  
   10.7. [🧾 Creación de checkout](#-creación-de-checkout)  
   10.8. [🧷 Tokenización y pago 1 clic](#-tokenización-y-pago-1-clic)  
      10.8.1. [🧷 Tokenización (primer pago)](#-tokenización-primer-pago)  
      10.8.2. [⚙️ Pago 1 clic](#️-pago-1-clic)  
11. [⚠️ Gestión de errores](#️-gestión-de-errores)  
12. [💻 Ejemplos de integración](#-ejemplos-de-integración)  
   12.1. [💳 Crear cargo con tarjeta (cURL)](#-crear-cargo-con-tarjeta-curl)  
   12.2. [📲 Crear cargo con Bizum (cURL)](#-crear-cargo-con-bizum-curl)  
   12.3. [☕ Tokenización y pago 1 clic (Java)](#-tokenización-y-pago-1-clic-java)  
13. [🧪 Pruebas en sandbox](#-pruebas-en-sandbox)  
14. [✅ Checklist de salida a producción](#-checklist-de-salida-a-producción)  
15. [🛡️ Cumplimiento normativo y operativo](#-cumplimiento-normativo-y-operativo)  
16. [📚 Librerías cliente](#-librerías-cliente)  
17. [🔗 Resources](#-resources)  
18. [🗒️ Changelog](#-changelog)  

---

## 🧠 Conceptos clave

En este apartado se presentan los términos fundamentales que se utilizarán a lo largo de la guía.

- **Cargo (`charge`)**: Representa una operación de pago iniciada desde el comercio.  
- **Autorización**: Pago estándar con cargo inmediato en cuenta.  
- **Preautorización**: Retención temporal que debe confirmarse en un segundo paso (sólo sectores regulados).  
- **Confirmación de preautorización**: Conversión de una retención en cargo definitivo.  
- **Devolución (`refund`)**: Operación iniciada por el comercio para devolver un cargo (total o parcial).  
- **Anulación (`reversal` o `cancel`)**: Cancelación de una operación antes de su liquidación.  
- **Checkout**: Proceso de pago mediante formulario Wipop integrado.  
- **Link de pago**: URL generada para que el comprador complete un pago desde cualquier canal.  
- **Tokenización**: Sustitución de datos sensibles de tarjeta por un token reutilizable.  
- **Pagos recurrentes**: Cargos periódicos sobre un token previamente autorizado.  

## 👥 Roles y responsabilidades

- **Comercio**: Inicia cargos, confirma preautorizaciones, solicita devoluciones o anulaciones y expone un endpoint para webhooks.  
- **Wipop**: Pasarela que orquesta las operaciones, conecta con esquemas de pago y aplica controles de seguridad.  
- **Adquirente / red de pagos**: Entidad financiera que procesa la operación y confirma el resultado.  

## 🌐 Entornos y credenciales

- **Sandbox**: Para pruebas sin impacto real.  
- **Producción**: Operaciones en vivo.  

**Elementos comunes**:

- API key por entorno.  
- Clave de firma de webhooks.  
- Posibilidad de restricción de IPs.  
- 🔐 **Buenas prácticas**: rotación de credenciales, almacenamiento en gestor de secretos y pipelines CI/CD separados por entorno.

## 🔐 Autenticación y seguridad

> 🛡️ **Imprescindible**: verifica siempre la firma `Wipop-Signature` y usa TLS 1.2+.

- **Authorization**: `Bearer <API_KEY>` en todas las llamadas.  
- **HTTPS**: Obligatorio.  
- **Webhooks firmados**: Cabecera `Wipop-Signature` (HMAC).  
- **Idempotencia**: `Idempotency-Key` en cargos, devoluciones y tokenizaciones.  
- **Relojes sincronizados**: NTP y validación de marcas de tiempo (±5 minutos) para mitigar *replay*.  

## 🏷️ Versionado de API

- Prefijo de versión en ruta, por ejemplo: `/v1/`.  
- Cambios incompatibles promueven nueva versión: `/v2/`.  

## 🔄 Tipos de operaciones

Wipop soporta diferentes tipos de operaciones para adaptarse a varios modelos de negocio.

### 💳 Autorizaciones (compra directa)

- Cargo estándar en tiempo real.  
- Compatible con PSD2 / 3DS v2.  
- Uso general en eCommerce.  

### 🕒 Preautorizaciones y confirmaciones

- Retención de importe en cuenta del comprador.  
- Confirmación obligatoria dentro de **7 días** (normativa PSD2).  
- Restricción de sectores: hoteles, agencias de viaje y *rent-a-car*.  
- Garantía de pago tras confirmación.  

### ↩️ Devoluciones

- Totales o parciales.  
- Invocables desde API o *dashboard*.  
- Consideraciones de adquirente: saldo operativo y validación de operación original.  

### 🛑 Anulaciones

- Anulación previa a captura o dentro de la ventana permitida por esquema/adquirente.  
- Evita apuntes contables posteriores.  

### 🧷 Tokenización y pagos recurrentes

- Primer pago con autenticación 3DS obligatoria.  
- Pagos 1 clic (*Card on File*) con `source_id`.  
- Recurrentes: iniciados por el comercio sin presencia del titular (MIT).  

## 📲 Flujos Bizum

- **Consulta previa RTP**: Verifica si el usuario tiene Bizum y su tipo de autenticación.  
- **Bizumer con RTP**: Confirma en su app bancaria.  
- **Bizumer sin RTP**: Flujo con clave Bizum y OTP.  
- **Errores frecuentes**: “Tu teléfono no está registrado para compras online”.  
- **Pantallas de compra**: Formularios *responsive* y accesibles para teléfono y OTP.  

## 🔔 Webhooks

> 🔁 **Idempotencia recomendada**: procesa webhooks de forma idempotente usando `event.id` o `request_id`.

**Eventos comunes**: `charge.authorized`, `charge.captured`, `charge.failed`, `charge.canceled`, `refund.succeeded`, `refund.failed`.  
**Seguridad**: verifica `Wipop-Signature` con HMAC y rechaza notificaciones inválidas o caducadas.

## 🧩 Modelos principales

### 📦 Objeto `charge`

```json
{
  "id": "ch_01ABC...",
  "order_id": "PED-2025-000123",
  "method": "card",
  "amount": 4599,
  "currency": "EUR",
  "status": "pending",
  "customer": {
    "phone": "+34XXXXXXXXX",
    "email": "cliente@correo.com"
  },
  "capture": true,
  "created_at": "2025-09-08T10:21:03Z",
  "updated_at": "2025-09-08T10:21:03Z"
}
```

**Estados**: `pending`, `authorized`, `captured`, `failed`, `canceled`, `refunded`.

### 💸 Objeto `refund`

```json
{
  "id": "rfnd_01XYZ...",
  "charge_id": "ch_01ABC...",
  "amount": 2000,
  "reason": "customer_request",
  "status": "succeeded",
  "created_at": "2025-09-08T10:30:00Z"
}
```

**Estados**: `pending`, `succeeded`, `failed`.

### 🧾 Objeto `checkout`

```json
{
  "id": "chk_01LMN...",
  "url": "https://checkout.wipop.com/session/xyz",
  "status": "active",
  "amount": 4599,
  "currency": "EUR"
}
```

### 🔖 Objeto `token`

```json
{
  "id": "tok_01DEF...",
  "card_last4": "4242",
  "expiry": "12/27",
  "created_at": "2025-09-08T10:40:00Z"
}
```

## 🧭 Endpoints principales

- **Sandbox**: `https://sand-api.wipop.es`  
- **Producción**: `https://api.wipop.es`

Operaciones más comunes: crear cargo, preautorización, confirmar preautorización, devolución, anulación, crear checkout, tokenizar tarjeta y crear pago recurrente.

### ⚡ Autorización directa con tarjeta (cargo inmediato)

**Endpoint**: `POST /v1/charges`

```json
{
  "method": "card",
  "amount": 4599,
  "currency": "EUR",
  "order_id": "PED-2025-000123",
  "capture": true
}
```

**Respuesta**: `201` con `status: "pending"` (+ `next_action` si 3DS) o `201` con `status: "captured"` si se completa al instante.  
**Siguiente paso**: esperar webhooks `charge.captured` o `charge.failed`.

### ⚡ Compra directa con Bizum

**Endpoint**: `POST /v1/charges`

```json
{
  "method": "bizum",
  "amount": 4599,
  "currency": "EUR",
  "order_id": "PED-2025-000124",
  "capture": true,
  "customer": { "phone": "+346XXXXXXXX" }
}
```

**Respuesta**: `201` con `status: "pending"` y `next_action: { "type": "bizum_prompt" }`.  
**Siguiente paso**: confirmación en app bancaria → `charge.captured` o `charge.failed`.

### 🪜 Preautorización con tarjeta (dos pasos)

**Endpoint**: `POST /v1/charges`

```json
{
  "method": "card",
  "amount": 15000,
  "currency": "EUR",
  "order_id": "RES-2025-000777",
  "capture": false
}
```

**Respuesta**: `201` con `status: "authorized"`.  
**Siguiente paso**: `POST /v1/charges/{charge_id}/capture` o `POST /v1/charges/{charge_id}/cancel`.

### 📥 Confirmación de preautorización (captura)

**Endpoint**: `POST /v1/charges/{charge_id}/capture`

```json
{ "amount": 15000 }
```

**Respuesta**: `200/201` con `status: "captured"`.  
**Resultado**: pedido cobrado listo para liquidación.

### ↩️ Devolución (total o parcial)

**Endpoint**: `POST /v1/refunds`

```json
{
  "charge_id": "ch_01ABC...",
  "amount": 2000,
  "reason": "customer_request"
}
```

**Respuesta**: `201` con objeto `refund` (`pending` o `succeeded`).  
**Resultado**: `charge` asociado pasará a `refunded` si es total (o estado equivalente si parcial).

### 🛑 Anulación de operación

**Endpoint**: `POST /v1/charges/{charge_id}/cancel`  
**Body**: vacío (o `reason`).  
**Respuesta**: `200` con `status: "canceled"`.  
**Resultado**: operación cerrada sin cargo al cliente.

### 🧾 Creación de checkout

**Endpoint**: `POST /v1/checkouts`

```json
{
  "amount": 4599,
  "currency": "EUR",
  "order_id": "PED-2025-000555",
  "capture": true,
  "redirect_url": "https://tu-sitio.com/ok"
}
```

**Respuesta**: `201` con objeto `checkout` y campo `url`.  
**Resultado**: tras completar el formulario, llegarán webhooks con el estado del `charge` generado.

### 🧷 Tokenización y pago 1 clic

#### 🧷 Tokenización (primer pago)

**Endpoint**: `POST /v1/tokens`

```json
{
  "card": {
    "number": "4242...",
    "exp_month": 12,
    "exp_year": 2027,
    "cvc": "123"
  }
}
```

**Respuesta**: `201` con token (`tok_…`).

#### ⚙️ Pago 1 clic

**Endpoint**: `POST /v1/charges`

```json
{
  "method": "card",
  "amount": 990,
  "currency": "EUR",
  "order_id": "SUB-2025-0009",
  "source_id": "tok_01DEF...",
  "post_type": "recurrent",
  "capture": true
}
```

**Respuesta**: `201` con `status: "pending"` o `captured` según la red.  
**Resultado**: cargo recurrente sin intervención del titular (SCA satisfecha en el alta).

## ⚠️ Gestión de errores

```json
{
  "error": {
    "type": "invalid_request",
    "code": "phone_invalid",
    "message": "El teléfono del cliente no es válido",
    "param": "customer.phone",
    "request_id": "req_01ABC..."
  }
}
```

Códigos frecuentes: `invalid_request`, `authentication_error`, `rate_limit`, `processing_error`, `payment_declined`.

## 💻 Ejemplos de integración

### 💳 Crear cargo con tarjeta (cURL)

```bash
curl -X POST "https://sand-api.wipop.es/v1/charges"   -H "Authorization: Bearer $API_KEY"   -H "Idempotency-Key: $(uuidgen)"   -H "Content-Type: application/json"   -d '{
    "method": "card",
    "amount": 4599,
    "currency": "EUR",
    "order_id": "PED-2025-000123",
    "capture": true
  }'
```

### 📲 Crear cargo con Bizum (cURL)

```bash
curl -X POST "https://sand-api.wipop.es/v1/charges"   -H "Authorization: Bearer $API_KEY"   -H "Idempotency-Key: $(uuidgen)"   -H "Content-Type: application/json"   -d '{
    "method": "bizum",
    "amount": 4599,
    "currency": "EUR",
    "order_id": "PED-2025-000124",
    "capture": true,
    "customer": { "phone": "+346XXXXXXXX" }
  }'
```

### ☕ Tokenización y pago 1 clic (Java)

```java
CreateChargeParams params = new CreateChargeParams()
  .method(ChargeMethod.CARD)
  .amount(BigDecimal.valueOf(10))
  .currency(Currency.EUR)
  .orderId("ORD-12345")
  .useCof(true)
  .terminal(createTerminal());

Charge charge = client.chargeOperation().create(params);
```

## 🧪 Pruebas en sandbox

> 🧰 **Sugerencia**: automatiza casos con `make` o scripts de CI para repetir pruebas *E2E*.

- Tarjetas de prueba y teléfonos Bizum ficticios.  
- Casos: autorización, rechazo, preautorización, devolución, anulación, recurrentes.  
- Verificación de webhooks y reintentos.  

## ✅ Checklist de salida a producción

- Uso de claves seguras y rotadas.  
- Verificación de firmas de webhooks.  
- Certificados TLS válidos.  
- Monitorización y alertas configuradas.  
- Cumplimiento PSD2 y RGPD.  
- Documentación de soporte actualizada.  

## 🛡️ Cumplimiento normativo y operativo

- **PSD2**: Autenticación reforzada, 3DS v2, exenciones documentadas.  
- **RGPD**: Minimización de datos, retención controlada, consentimiento informado.  
- **PCI DSS**: Los datos de tarjeta nunca deben almacenarse sin tokenización.  
- **Modelo operativo**: Roles, responsabilidades y trazabilidad bien definidos.  

## 📚 Librerías cliente

- **Java client**: disponible vía Maven (`wipop-java-client`).  
- Soporta Sandbox y Producción.  
- Incluye cargo, checkout, tokenización, recurrentes y devoluciones.  
- Manejo de errores con excepciones específicas.  
- Timeouts personalizables.  

## 🔗 Resources

1) Documento funcional de Bizum  
2) Documento funcional de tipos de operaciones  
3) Documento de tokenización  
4) Librerías cliente Java (LEEME y README)  
5) Referencias externas: Revolut Open Banking API, docs de terceros y Stripe API Reference  

## 🗒️ Changelog

- **v1.0 (08/09/2025)**: Primera versión del contrato propuesto y guía paso a paso.
