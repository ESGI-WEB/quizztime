# Prerequisites
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

# Installation
- Launch `docker compose up -d`
- Wait for the containers to be up and running, it may take a few minutes for ports 80 and 8080 to redirect to the frontend and backend respectively, check the containers logs to see when the builds are finished
- Open your browser and go to `http://localhost:80` for frontend
- Open your browser and go to `http://localhost:8080` for backend

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

# Contributions de l'équipe
- Théo Dubuisson
- Laurie Morin
- Nicolas Wadoux