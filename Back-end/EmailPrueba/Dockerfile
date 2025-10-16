# Etapa base: usar Java 17 como entorno
FROM openjdk:17-jdk-slim

# Crear un directorio dentro del contenedor
WORKDIR /app

# Copiar el JAR generado por Maven al contenedor
COPY target/emailservice-1.0.0.jar /app/emailservice.jar

# Exponer el puerto del servidor
EXPOSE 8080

# Ejecutar la aplicación al iniciar el contenedor
ENTRYPOINT ["java", "-jar", "/app/emailservice.jar"]
