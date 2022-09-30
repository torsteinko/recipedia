# Recipedia applikasjon

## Getting Started

These instructions will give you a copy of the project up and running on your local machine for development and testing purposes

### Installing

Clone the repository to your local machine

Create /backend/.env

```
SECRET_KEY=<INSERT_DJANGO_SECRET_KEY>
```

Build Docker images

```
docker compose build
```

Run project

```
docker compose up
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate
```

Load initial data

```
docker compose exec backend python manage.py loaddata users
docker compose exec backend python manage.py loaddata app
```

This command pushes initial data from fixtures and default superuser:

| Username | Password |
| -------- | :------: |
| root     |   123    |

Backend admin is accessed at `127.0.0.1:8000/admin` with graphQL endpoint `127.0.0.1:8000/graphql`. Frontend runs on `127.0.0.1:3000`

If your machine can't find the next module, run
´´´
npm install
´´´
In the frontend folder

To install Pillow use
´´´
docker compose exec backend pip install pillow
´´´

Create a superuser:
´´´
docker compose exec backend python manage.py createsuperuser
´´´

Updating the app and user fixtures is done as follows:
´´´
docker compose exec backend python manage.py dumpdata --format yaml app > backend/app/fixtures/app.yaml
docker compose exec backend python manage.py dumpdata --format yaml auth.user > backend/app/fixtures/users.yaml
´´´

Installing dependencies for date picker in edit profile:
´´´
docker compose exec frontend npm install date-fns --save
docker compose exec frontend npm install @mui/lab
´´´
