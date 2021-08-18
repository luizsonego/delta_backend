# Backend Teste


install dependencies
```
$ yarn install 
```
- important - run sqlite version 5.0.0, recent versions are broken

create db (based on sqlite)
```
yarn typeorm migration:run
```

start server
```
$ yarn dev
```

within the application has file of rest routes.

api.http
