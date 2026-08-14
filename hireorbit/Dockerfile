FROM eclipse-temurin:17

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 8080 10000

CMD ["java", "-jar", "target/hireorbit-0.0.1-SNAPSHOT.jar"]