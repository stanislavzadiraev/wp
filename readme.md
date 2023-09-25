# Локальный WordPress
## Подготовка системы
### Docker
установка
```
sudo snap install docker --classic
```
подготовка
```
sudo groupadd docker
sudo usermod --append --groups docker $USER
# точно требуется выход пользователя из истемы
# возможно требуется презагрузка системы
```
###  NodeJS
установка
```
sudo snap install node --classic
```
## Подготовка проекта
### Проект
создание `package.json` проекта 
```
npm init
```
### Пакет
установка
```
npm install https://github.com/stanislavzadiraev/wp.git
```
изменение `package.json` проекта
```
  "type": "module",

  "scripts": {
    "wp": "wp"
  },
```
## Работа пакета
### Конфигурация
файл конфигурации `wp.config.js` с минимальным числом параметров
```
export default {
}
```
файл конфигурации `wp.config.js` с максимальным числом параметров
```
export default {
    //точка монтирования в проект файловой системы Wordpress
    wpslug: 'wordpress',

    // точка монтирования в проект файловой системы MySQL 
    dbslug: 'database',

    // параметры MySQL
    dbname: 'base',
    dbuser: 'user',
    dbword: 'word',

    // порт доступа PHPmyAdminer
    dbport: '9090',

    // параметры WordPress
    wplang: 'ru_RU',
    wptitle: 'Some Title',

    wpuser: 'user',
    wpword: 'word',
    wpmail: 'mail@nowhere.void',

    // порт доступа WordPress
    wpport: '8080',

    // точки монтирования файловых подсистем WordPress (wp-content)
    wpcontent: [
      ['theme', 'themes/theme'],
      ['plugin', 'plugins/plugin'],
      ['upload', 'uploads/upload'],
    ],
}
```
### Выполнение
```
npm run wp
```
### Результат
файл конфигурации Docker
\
`docker-compose.yml`
\
файл команды очистки
\
`./prune`