#!/usr/bin/env bash
# Render Build Script for HireOrbit (Java 17 setup for Node/Native runtime)
set -e

echo "==> Checking Java 17 environment on Render..."

if ! command -v java &> /dev/null || [[ $(java -version 2>&1) != *"17"* ]]; then
  if [ ! -d "$HOME/.jdk-17/bin" ]; then
    echo "==> Downloading and configuring OpenJDK 17 Temurin..."
    mkdir -p "$HOME/.jdk-17"
    curl -sSL "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.10%2B7/OpenJDK17U-jdk_x64_linux_hotspot_17.0.10_7.tar.gz" | tar -xz -C "$HOME/.jdk-17" --strip-components=1
  fi
  export JAVA_HOME="$HOME/.jdk-17"
  export PATH="$JAVA_HOME/bin:$PATH"
fi

echo "==> Active Java Version:"
java -version

echo "==> Building Spring Boot JAR..."
cd hireorbit
chmod +x mvnw
./mvnw clean package -DskipTests

echo "==> Build completed successfully!"

