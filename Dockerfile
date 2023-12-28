FROM postgres:latest

# Install necessary extensions
RUN apt-get update \
    && apt-get install -y postgresql-contrib \
    && rm -rf /var/lib/apt/lists/*

# Install earthdistance extension
RUN echo "CREATE EXTENSION IF NOT EXISTS cube;" >> /docker-entrypoint-initdb.d/init_extensions.sql \
    && echo "CREATE EXTENSION IF NOT EXISTS earthdistance;" >> /docker-entrypoint-initdb.d/init_extensions.sql

# Copy additional initialization scripts if needed
COPY init_extensions.sql /docker-entrypoint-initdb.d/
