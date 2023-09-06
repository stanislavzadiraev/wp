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
### Wordpress
port:\
 `localhost:8080`

volumes:\
`./plugins/`\
`./themes/`\
`./uploads/`
### Adminer
port:\
`localhost:9090`
### WP-CLI
command:\
`/bin/sh -c '#####'`
