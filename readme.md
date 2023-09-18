# Локальный WordPress
## Система
### Установка
Git:
```console
git clone https://github.com/stanislavzadiraev/wp.git
```
### Подготовка
подготовка окружения
```console
./uidgid
```
### Настройка
общая зачистка
```console
./prune
```
зачистка базы данных и файловых подсистем
```console
./prunedb
./prunewp
```
зачистка контейнеров и вольюмов
```console
./prunedc
``` 
### Запуск
Docker:
```console
docker compose up
```
## Контейнер
docker-compose.yml:
### MySQL
ports:\
`none`\
volumes:\
`./database/`
### PHPmyAdmin
ports:\
`7070`\
volumes:\
`none`
### Wordpress
ports:\
 `8080`\
volumes:\
`./wordpress/`\
### WP-CLI
ports:\
`none`\
volumes:\
`none`\