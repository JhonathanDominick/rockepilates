FROM eclipse-temurin:21-jdk

WORKDIR /app

COPY backend/gerenciador-service/build/libs/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]