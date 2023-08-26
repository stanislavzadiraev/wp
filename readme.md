# Локальный WordPress
## Подготовка
Snap:
```console
snap install docker --classic
```
## Установка
Git:
```console
git clone https://github.com/stanislavzadiraev/wp.git
```
## Настройка
чтение/запись/выполнение
```console
chmod -R 777 plugins
chmod -R 777 themes
```
## Запуск
Docker:
```console
docker compose up
```