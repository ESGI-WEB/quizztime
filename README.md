# Prerequisites
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

# Installation
- Launch `docker compose up -d`
- Wait for the containers to be up and running, it may take a few minutes for ports 80 and 8080 to redirect to the frontend and backend respectively, check the containers logs to see when the builds are finished
- Open your browser and go to `http://localhost:80` for frontend
- Open your browser and go to `http://localhost:8080` for backend

# Bonus Implémentés
- Stockage de données persistant : Enregistrement des données de réponses en cours de quiz, le résumé est affiché à la fin. La création de quiz et de comptes est aussi persistante (cf schema.prisma).
- Authentification des utilisateurs : Les utilisateurs peuvent se connecter et s'inscrire pour accéder à des fonctionnalités supplémentaires comme la création de quiz.
- Gestion avancée des salles : protection par mot de passe hashé et/ou les limites d'utilisateurs maximum (sauf admin). Il suffit de créer un quiz avec un mot de passe ou une limite, qui seront imposés pour pouvoir rejoindre la salle.
- Tableau de classement en temps réel : Côté admin, affichage en temps réel question pas question des réponses des utilisateurs.
- Paramètres de quiz personnalisables : Limite de temps customizable en cours de quizz, réponses affichées aléatoirement.
- Améliorations de l'accessibilité : Mise en place des aria, descriptions pour les images, etc

# Fonctionnalités avancées de Socket.IO :
- Synchronisation des états de jeu : Implémenté par Nicolas Wadoux
- Chat en direct lors des quiz : Implémenté par Théo Dubuisson
- Notifications en temps réel : Implémenté par Nicolas Wadoux
- Réglage du temps par question en temps réel : Implémenté par Laurie Morin

# Contributions de l'équipe
- Théo Dubuisson (Teyo01)
    - Mise en place de Socket.IO
    - Mise en place de la DB
    - Mise en place du chat en direct
    - Formulaire de Création de quizz
    - Mise en place du listing des quizz
    - Dockerisation
    - Gestion avancée des salles avec protection par mot de passe hashé et/ou les limites d'utilisateurs maximum
- Laurie Morin (mlaurie)
    - Mise en place de Socket.IO
    - Mise en place de la DB
    - Minuteur côté serveur, changeable par l'admin en cours de quizz
    - Diffusion du nouveau minuteur aux clients instantanément
    - Mise en place de l'accessibilité
- Nicolas Wadoux (Nicolas-Wadoux-ESGI)
    - Mise en place de Socket.IO et de la DB
    - Mise en place de la gestion de salles différentes en simultané
    - Diffusion des questions et réception des réponses en temps réel
    - Présentation en temps réel des question/réponses des utilisateurs + retour sur les réponses + résultat en fin de quizz
    - Synchronisation des états de jeu
    - Notifications en temps réel sur les différents états du quizz
    - Authentification des utilisateurs (login, register)
    - Tableau de classement en temps réel

# Prisma
- When docker is launched, prisma is automatically generated and creates the db according to the already existing migrations


To create migration + update the database, run:
```bash
docker exec express npx prisma migrate dev --name <fill_migration_name>
```

To create a migration without updating database, run:
```bash
docker exec express npx prisma migrate dev --name <fill_migration_name> --create-only
```