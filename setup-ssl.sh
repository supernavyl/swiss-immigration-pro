#!/bin/bash
# Setup Let's Encrypt SSL certificates for Swiss Immigration Pro
# Run this on your VPS after docker compose is running.
#
# Usage: ./setup-ssl.sh yourdomain.com [your@email.com]

set -euo pipefail

DOMAIN="${1:?Usage: ./setup-ssl.sh yourdomain.com [email@example.com]}"
EMAIL="${2:-admin@$DOMAIN}"

echo "==> Setting up SSL for $DOMAIN (email: $EMAIL)"

# Create certbot directories
mkdir -p certbot/conf certbot/www

# Stop nginx temporarily to free port 80
docker compose stop nginx 2>/dev/null || true

# Get certificate using standalone mode
docker run --rm \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  -p 80:80 \
  certbot/certbot certonly \
    --standalone \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

# Create a marker file so nginx knows to redirect HTTP → HTTPS
touch "certbot/conf/live/certs-ready"

# Update nginx config domain (replace placeholder)
sed -i "s|swissimmigrationpro.com|$DOMAIN|g" nginx/nginx.conf

# Restart everything
docker compose up -d nginx

echo ""
echo "==> SSL setup complete!"
echo "    https://$DOMAIN should now be live."
echo ""
echo "    To auto-renew certs, add this crontab:"
echo "    0 3 * * * cd $(pwd) && docker run --rm -v ./certbot/conf:/etc/letsencrypt -v ./certbot/www:/var/www/certbot certbot/certbot renew --quiet && docker compose exec nginx nginx -s reload"
