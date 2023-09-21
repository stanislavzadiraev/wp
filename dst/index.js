import { writeFile, mkdir } from 'node:fs/promises'
import { userInfo } from 'node:os'
const PATH = process.cwd()

const {uid:UID, gid:GID} = userInfo()

const R = {recursive: true}

const plugins = [
  'advanced-custom-fields',
  'woocommerce',
  'media-sync',
  'post-duplicator',
  'create-block-theme',
  'advanced-query-loop',
  'content-blocks-builder',
  'icon-block',
]

const themes = [

]

const INDEX = ({
        wppath = 'wordpress',
        dbpath = 'database',

        dbname = 'base',
        dbuser = 'user',
        dbword = 'word',

        dbport = '9090',

        wplang = 'ru_RU',
        wptitle = 'Some Title',

        wpuser = 'user',
        wpword = 'word',
        wpmail = 'mail@nowhere.void',

        wpport = '8080',

        wpcontent = [
          ['theme', 'themes/theme'],
          ['plugin', 'plugins/plugin'],
          ['upload', 'uploads/upload'],
        ],
    }) =>
    Promise.all([
      mkdir(PATH + `/` + wppath, R).catch(_=>_),
      mkdir(PATH + `/` + dbpath, R).catch(_=>_),
        Promise.all(wpcontent.map(([src, dst]) =>
          Promise.all([
            mkdir(src, R).catch(_=>_),
            mkdir(PATH + `/` + wppath + `/wp-content/` + dst, R).catch(_=>_)
          ])
        )),
        writeFile(
            PATH + '/docker-compose.yml',
            `
            version: '3.1'

            name: wp
            
            services:
              mysql:
                image: mysql:latest
                restart: always
                environment:
                  MYSQL_RANDOM_ROOT_PASSWORD: OK
                  MYSQL_DATABASE: ${dbname}
                  MYSQL_USER: ${dbuser}
                  MYSQL_PASSWORD: ${dbword}
                user: "${UID}:${GID}"
                volumes:
                  - ./${dbpath}/:/var/lib/mysql/
            
              phpmyadmin:
                image: phpmyadmin:latest
                restart: always
                depends_on:
                  mysql:
                    condition: service_started
                ports:
                  - ${dbport}:80
                environment:
                  PMA_HOST: mysql
                  PMA_USER: ${dbuser}
                  PMA_PASSWORD: ${dbword}
            
              wordpress:
                image: wordpress:latest
                restart: always
                depends_on: 
                  mysql:
                    condition: service_started
                ports:
                  - ${wpport}:80
                user: "${UID}:${GID}"
                volumes: [
                  ./${wppath}/:/var/www/html/,
                  ${wpcontent.map(([src, dst])=>`./${src}/:/var/www/html/wp-content/${dst}/`).join(', ')}
                ]
            
              wp-cli:    
                image: wordpress:cli
                depends_on:
                  wordpress:
                    condition: service_started
                  mysql:
                    condition: service_started
                user: "${UID}:${GID}"
                volumes: [
                  ./${wppath}/:/var/www/html/,
                  ${wpcontent.map(([src, dst])=>`./${src}/:/var/www/html/wp-content/${dst}/`).join(', ')}
                ]
          
                command: >
                  /bin/sh -c '
                    sleep 40
            
                    wp config create\
                      --dbhost=mysql\
                      --dbname=${dbname}\
                      --dbuser=${dbuser}\
                      --dbpass=${dbword}\
                      --skip-check\
            
                    wp core install\
                      --path="/var/www/html"\
                      --url=http://localhost:${wpport}\
                      --title="${wptitle}"\
                      --admin_user=${wpuser}\
                      --admin_password=${wpword}\
                      --admin_email=${wpmail}\ 
            
                    wp core update
            
                    wp language core install ${wplang}
                    wp language core activate ${wplang}
            
                    wp plugin delete\
                      akismet\
                      hello\
            
                    wp plugin install ${plugins.join(' ')}
            
                    wp plugin update --all
                    wp plugin activate --all
            
                    wp theme delete\
                      twentytwentyone\
                      twentytwentytwo\
                      
                    wp theme install ${themes.join(' ')}
                  '
            `
        ),
        writeFile(
          PATH + '/prune',
          `
          #!/bin/sh

          yes | rm -R ./${dbpath}
          yes | rm -R ./${wppath}
          yes | rm ./docker-compose.yml
          yes | rm ./prune
          `,
          {mode: 0o755}
      ),         
    ])

export default INDEX