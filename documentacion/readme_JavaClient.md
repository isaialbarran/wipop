# 📘 Wipop Java Client

A Java client library for integrating with the Wipop payment processing API.  
Allows merchants and platforms to accept payments by card, Bizum, and other methods in a simple, secure, and type-safe way.

---

## 🚀 Features

- Charge operations: create, confirm, capture, refund, and reverse charges  
- Checkout operations: create checkout sessions for redirected payments  
- Support for sandbox and production environments  
- Type safety with full domain models  
- *Builder* pattern to construct request parameters  
- Structured error and exception handling

---

## 📋 Requirements

- Java 17 or higher  
- Maven 3.6 or higher  

```xml
<dependency>
  <groupId>es.openpay</groupId>
  <artifactId>wipop-java-client</artifactId>
  <version>0.0.1-SNAPSHOT</version>
</dependency>
```

---

## ⚙️ Configuration

### Environments

- Sandbox: `https://sand-api.wipop.es`  
- Production: `https://api.wipop.es`

### Basic example

```java
WipopClientConfiguration config = new WipopClientConfiguration(
    WipopClientConfiguration.Environment.SANDBOX,
    "your-merchant-id",
    "your-secret-key"
);

WipopClient client = WipopClient.of(config);
```

### HTTP Configuration

Allows custom *timeouts*:

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

## 💳 Main Operations

### Create customer and terminal

```java
Customer customer = new Customer();
customer.setName("Foo");
customer.setLastName("Bar");
customer.setEmail("foo.bar@example.com");

Terminal terminal = new Terminal();
terminal.setId("1");
```

### Charge by card

```java
CreateChargeParams params = new CreateChargeParams()
    .method(ChargeMethod.CARD)
    .amount(BigDecimal.valueOf(100))
    .currency(Currency.EUR)
    .orderId("order-123")
    .description("Card purchase")
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

### Charge by Bizum

```java
CreateChargeParams params = new CreateChargeParams()
    .method(ChargeMethod.BIZUM)
    .amount(BigDecimal.valueOf(50))
    .currency(Currency.EUR)
    .orderId("order-456")
    .description("Bizum purchase")
    .productType(ProductType.PAYMENT_LINK)
    .originChannel(OriginChannel.API)
    .capture(true)
    .customer(customer)
    .terminal(terminal);

Charge charge = client.chargeOperation().create(params);

System.out.println(charge.getStatus());
System.out.println(charge.getRedirectUrl());
```

### Tokenization and future payments

- Token generation in the first payment  
- One-click payments with `sourceId`  
- Recurring payments (*subscriptions*)  

```java
CreateChargeParams params = new CreateChargeParams()
    .amount(BigDecimal.valueOf(20))
    .currency(Currency.EUR)
    .orderId("order-789")
    .description("Monthly subscription")
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

*(also available: confirm pending charge, refund, reverse, capture pre-authorization, and create checkout)*

---

## ⚠️ Error Handling

All operations may throw `WipopClientException`.

```java
try {
    Charge charge = client.chargeOperation().create(params);
} catch (WipopClientException e) {
    System.err.println("Wipop error: " + e.getMessage());
}
```

---

## 📚 Quick reference

### Main classes
- `WipopClient`  
- `WipopClientConfiguration`  
- `ChargeOperation`  
- `CheckoutOperation`  

### Domain models
- `Charge`, `Checkout`, `Customer`, `Terminal`, `Card`, `Address`  

### Parameters
- `CreateChargeParams`, `ConfirmChargeParams`, `RefundParams`,  
  `ReversalParams`, `CaptureParams`, `CheckoutParams`

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Implement your changes  
4. Add tests  
5. Submit a pull request  

---

## 📄 License and Support

This project is licensed under the terms specified in the project's license file.  

For support, refer to the official Wipop documentation or contact the development team.

---

## 📝 Changelog

- **v1.0 (08/09/2025)**: First version of the library and integration guide.
