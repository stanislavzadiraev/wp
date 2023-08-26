# Локальный WordPress
## Подготовка
Подготовка
```console
sudo snap install docker --classic
```
## Установка
```console
git clone https://github.com/stanislavzadiraev/wp.git
```
## Настройка
```python
chmod -R 777 plugins
chmod -R 777 themes
```
## Запуск
Docker:
```console
docker compose up
```