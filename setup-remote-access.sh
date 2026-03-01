#!/bin/bash
# Quick setup to access site from other computers

set -e

echo "🌍 ACCESS YOUR SITE FROM OTHER COMPUTERS"
echo "=========================================="
echo ""
echo "Choose an option:"
echo ""
echo "1) Local Network Only (same WiFi)"
echo "2) Internet Access (public domain)"
echo "3) Both Local + Internet"
echo ""
read -p "Choose (1-3): " option

case $option in
    1)
        echo ""
        echo "📍 LOCAL NETWORK SETUP"
        echo ""
        echo "Finding your computer's IP address..."
        echo ""

        # Get IP based on OS
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            IP=$(hostname -I | awk '{print $1}')
            echo "Your IP: $IP"
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}')
            echo "Your IP: $IP"
        else
            echo "Please run: ipconfig (Windows) to find your IP"
            exit 1
        fi

        echo ""
        echo "✅ Setup:"
        echo ""
        echo "1. Start backend:"
        echo "   docker-compose up"
        echo ""
        echo "2. Start web (new terminal):"
        echo "   cd swiss-immigration-pro"
        echo "   npm run dev"
        echo ""
        echo "3. On other computer, open:"
        echo "   http://$IP:3000"
        echo ""
        echo "✅ Done! Access your site locally!"
        ;;

    2)
        echo ""
        echo "🌐 INTERNET ACCESS SETUP"
        echo ""
        read -p "Enter your domain (example.com): " domain
        echo ""

        if [ -z "$domain" ]; then
            echo "Domain required!"
            exit 1
        fi

        echo "Setting up Cloudflare for: $domain"
        echo ""

        bash cloudflare-setup.sh "$domain"

        echo ""
        echo "✅ Next steps:"
        echo "1. Follow: CLOUDFLARE_DNS_CONFIG.txt"
        echo "2. Add DNS records in Cloudflare"
        echo "3. Enable SSL/TLS → Full (Strict)"
        echo "4. Access: https://$domain"
        echo ""
        ;;

    3)
        echo ""
        echo "🔄 LOCAL + INTERNET SETUP"
        echo ""

        # Get local IP
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            LOCAL_IP=$(hostname -I | awk '{print $1}')
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}')
        fi

        read -p "Enter your domain (example.com): " domain

        if [ -z "$domain" ]; then
            echo "Domain required!"
            exit 1
        fi

        echo ""
        echo "Local Network:"
        echo "  Access: http://$LOCAL_IP:3000"
        echo ""
        echo "Internet:"
        echo "  Setting up: $domain"
        echo ""

        bash cloudflare-setup.sh "$domain"

        echo ""
        echo "✅ You now have:"
        echo "  Local: http://$LOCAL_IP:3000"
        echo "  Internet: https://$domain"
        echo ""
        ;;

    *)
        echo "Invalid option!"
        exit 1
        ;;
esac
