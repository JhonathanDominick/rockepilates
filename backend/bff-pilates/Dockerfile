FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY backend/bff-pilates/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]