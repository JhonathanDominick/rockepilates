FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY gradle.properties .
COPY backend/usuarios-service backend/usuarios-service

RUN sed -i 's/\r$//' gradlew
RUN chmod +x gradlew
RUN bash gradlew :backend:usuarios-service:bootJar --no-daemon


FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/backend/usuarios-service/build/libs/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]