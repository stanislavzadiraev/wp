# Локальный WordPress
## Система

### Подготовка
Snap:
```console
snap install docker --classic
```
### Установка
Git:
```console
git clone https://github.com/stanislavzadiraev/wp.git
```
### Настройка
общая зачистка
```console
./prune
```
#### файлы
разблокировка 
```console
./dbunlock
./wpunlock
```
восстановление
```console
./dbtouch
./wptouch
```
зачистка
```console
./dbprune
./wptouch
```
#### докер
зачистка контейнеров и томов
```console
./dсprune
``` 
### Запуск
Docker:
```console
docker compose up
```
## Контейнер
docker-compose.yml:
### MySQL
volumes:\
`./mysql/`
### Adminer
port:\
`localhost:9090`
### Wordpress
port:\
 `localhost:8080`\
volumes:\
`./plugins/`\
`./themes/`\
`./uploads/`
### WP-CLI
command:\
`/bin/sh -c '#####'`
