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
чтение/запись/выполнение
```console
chmod -R 777 plugins
chmod -R 777 themes
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
