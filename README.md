# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/23b2966e-a83b-49e6-90d0-bb5e2060af82

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/23b2966e-a83b-49e6-90d0-bb5e2060af82) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/23b2966e-a83b-49e6-90d0-bb5e2060af82) and click on Share -> Publish.

## Déployer sur votre propre serveur avec Nginx

Si vous souhaitez héberger l’application vous-même sur un serveur où Nginx est déjà installé, voici un guide rapide :

1. **Préparer l’application**
   - Installez les dépendances : `npm install`
   - Construisez la version de production : `npm run build`
   - Le dossier `dist/` généré contient les fichiers statiques à déployer.
2. **Transférer les fichiers sur le serveur**
   - Copiez le contenu de `dist/` vers un dossier sur le serveur, par exemple `/var/www/mon-site`.
   - Assurez-vous que l’utilisateur Nginx peut lire ces fichiers (`chown -R www-data:www-data /var/www/mon-site`).
3. **Configurer Nginx**
   - Créez un fichier de configuration, par exemple `/etc/nginx/sites-available/mon-site` :

     ```nginx
     server {
       listen 80;
       server_name exemple.com www.exemple.com;

       root /var/www/mon-site;
       index index.html;

       location / {
         try_files $uri $uri/ /index.html;
       }

       location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff2?)$ {
         expires 7d;
         add_header Cache-Control "public";
       }
     }
     ```

   - Activez le site : `ln -s /etc/nginx/sites-available/mon-site /etc/nginx/sites-enabled/`
   - Vérifiez la configuration : `sudo nginx -t`
   - Rechargez Nginx : `sudo systemctl reload nginx`
4. **Sécuriser avec HTTPS (optionnel mais recommandé)**
   - Installez Certbot : `sudo apt install certbot python3-certbot-nginx`
   - Générez un certificat : `sudo certbot --nginx -d exemple.com -d www.exemple.com`
   - Certbot mettra automatiquement à jour la configuration Nginx.

Après ces étapes, votre application Vite sera servie en production via Nginx.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
