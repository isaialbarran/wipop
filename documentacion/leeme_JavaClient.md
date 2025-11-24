# 📘 Wipop Java Client

Una librería cliente en Java para integrar con la API de procesamiento de pagos de Wipop.  
Permite a comercios y plataformas aceptar pagos con tarjeta, Bizum u otros métodos de forma sencilla, segura y tipada.

---

## 🚀 Características

- Operaciones de cargo: crear, confirmar, capturar, reembolsar y anular cargos  
- Operaciones de checkout: crear sesiones de checkout para pagos redirigidos  
- Soporte de entornos sandbox y producción  
- Seguridad de tipos con modelos de dominio completos  
- Patrón *builder* para construir parámetros de solicitud  
- Manejo estructurado de errores y excepciones

---

## 📋 Requisitos

- Java 17 o superior  
- Maven 3.6 o superior  

```xml
<dependency>
  <groupId>es.openpay</groupId>
  <artifactId>wipop-java-client</artifactId>
  <version>0.0.1-SNAPSHOT</version>
</dependency>
```

---

## ⚙️ Configuración

### Entornos

- Sandbox: `https://sand-api.wipop.es`  
- Producción: `https://api.wipop.es`

### Ejemplo básico

```java
WipopClientConfiguration config = new WipopClientConfiguration(
    WipopClientConfiguration.Environment.SANDBOX,
    "your-merchant-id",
    "your-secret-key"
);

WipopClient client = WipopClient.of(config);
```

### Configuración HTTP

Permite definir *timeouts* personalizados:

```java
WipopClientHttpConfiguration httpConfig = new WipopClientHttpConfiguration(10000, 45000);

WipopClientConfiguration config = new WipopClientConfiguration(
    WipopClientConfiguration.Environment.SANDBOX,
    "merchant-id",
    "secret-key",
    httpConfig
);
```

---

## 💳 Operaciones principales

### Crear cliente y terminal

```java
Customer customer = new Customer();
customer.setName("Foo");
customer.setLastName("Bar");
customer.setEmail("foo.bar@example.com");

Terminal terminal = new Terminal();
terminal.setId("1");
```

### Cargo con tarjeta

```java
CreateChargeParams params = new CreateChargeParams()
    .method(ChargeMethod.CARD)
    .amount(BigDecimal.valueOf(100))
    .currency(Currency.EUR)
    .orderId("order-123")
    .description("Compra tarjeta")
    .productType(ProductType.PAYMENT_LINK)
    .originChannel(OriginChannel.API)
    .capture(true)
    .customer(customer)
    .terminal(terminal);

Charge charge = client.chargeOperation().create(params);

System.out.println(charge.getId());
System.out.println(charge.getStatus());
System.out.println(charge.getAmount());
```

### Cargo con Bizum

```java
CreateChargeParams params = new CreateChargeParams()
    .method(ChargeMethod.BIZUM)
    .amount(BigDecimal.valueOf(50))
    .currency(Currency.EUR)
    .orderId("order-456")
    .description("Compra Bizum")
    .productType(ProductType.PAYMENT_LINK)
    .originChannel(OriginChannel.API)
    .capture(true)
    .customer(customer)
    .terminal(terminal);

Charge charge = client.chargeOperation().create(params);

System.out.println(charge.getStatus());
System.out.println(charge.getRedirectUrl());
```

### Tokenización y pagos futuros

- Generación de token en primer pago  
- Pagos en un clic con `sourceId`  
- Pagos recurrentes (*subscriptions*)  

```java
CreateChargeParams params = new CreateChargeParams()
    .amount(BigDecimal.valueOf(20))
    .currency(Currency.EUR)
    .orderId("order-789")
    .description("Suscripción mensual")
    .productType(ProductType.PAYMENT_GATEWAY)
    .originChannel(OriginChannel.API)
    .sourceId("stored-token-id")
    .useCof(true)
    .postType(new PostType(PostTypeMode.RECURRENT))
    .terminal(terminal);

Charge charge = client.chargeOperation().create(params);

System.out.println(charge.getId());
System.out.println(charge.getStatus());
```

*(también disponible: confirmar cargo pendiente, reembolsar, anular, capturar preautorización y crear checkout)*

---

## ⚠️ Manejo de errores

Todas las operaciones pueden lanzar `WipopClientException`.

```java
try {
    Charge charge = client.chargeOperation().create(params);
} catch (WipopClientException e) {
    System.err.println("Error en Wipop: " + e.getMessage());
}
```

---

## 📚 Referencia rápida

### Clases principales
- `WipopClient`  
- `WipopClientConfiguration`  
- `ChargeOperation`  
- `CheckoutOperation`  

### Modelos de dominio
- `Charge`, `Checkout`, `Customer`, `Terminal`, `Card`, `Address`  

### Parámetros
- `CreateChargeParams`, `ConfirmChargeParams`, `RefundParams`,  
  `ReversalParams`, `CaptureParams`, `CheckoutParams`

---

## 🤝 Contribuir

1. Haz fork del repositorio  
2. Crea una rama de funcionalidad  
3. Implementa tus cambios  
4. Añade pruebas  
5. Envía un pull request  

---

## 📄 Licencia y soporte

Este proyecto está licenciado según el archivo de licencia del repositorio.  

Para soporte, consulta la documentación oficial de Wipop o contacta con el equipo de desarrollo.

---

## 📝 Changelog

- **v1.0 (08/09/2025)**: Primera versión de la librería y guía de integración.
