FROM php:8.4.25-apache-bookworm@sha256:25d70665acee86d7231af7bc5464794abd14585f80210f85f22dfb0713ac8ec7

ARG BAIKAL_VERSION=0.12.1
ARG BAIKAL_SHA256=0449abb72b151d39d9c08c63cb83a05d9e9adb065b1165ef6786b0b6a13d203c

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends unzip; \
    curl -fsSLo /tmp/baikal.zip "https://github.com/sabre-io/Baikal/releases/download/${BAIKAL_VERSION}/baikal-${BAIKAL_VERSION}.zip"; \
    echo "${BAIKAL_SHA256}  /tmp/baikal.zip" | sha256sum -c -; \
    unzip -q /tmp/baikal.zip -d /var/www; \
    rm /tmp/baikal.zip; \
    apt-get purge -y --auto-remove unzip; \
    rm -rf /var/lib/apt/lists/*

COPY assets/apache.conf /etc/apache2/sites-available/000-default.conf

RUN printf 'ServerName localhost\n' > /etc/apache2/conf-available/servername.conf; \
    a2enconf servername; \
    a2enmod rewrite

WORKDIR /var/www/baikal
EXPOSE 80
