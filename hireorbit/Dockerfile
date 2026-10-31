FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=build /app/target/hireorbit-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=8080
EXPOSE 8080 10000

ENTRYPOINT ["java", "-Dserver.port=${PORT}", "-jar", "app.jar"]
