import { writeFile, mkdir } from 'node:fs/promises'
import { userInfo } from 'node:os'
const PATH = process.cwd()

const {uid:UID, gid:GID} = userInfo()

const INDEX = ({
        wpslug = 'wordpress',
        dbslug = 'database',

        dbname = 'base',
        dbuser = 'user',
        dbword = 'word',
        dbport = '9090',

        wplang = 'ru_RU',
        wpuser = 'user',
        wpword = 'word',        
        wpport = '8080',
    }) =>
    Promise.all([
        mkdir(PATH + `/` + wpslug).catch(_=>_),
        mkdir(PATH + `/` + dbslug).catch(_=>_),
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
                  - ./${dbslug}/:/var/lib/mysql/
            
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
                volumes:
                  - ./${wpslug}/:/var/www/html/
            
              wp-cli:    
                image: wordpress:cli
                depends_on:
                  wordpress:
                    condition: service_started
                  mysql:
                    condition: service_started
                user: "${UID}:${GID}"
                volumes:
                  - ./${wpslug}/:/var/www/html/
            
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
                      --url="http://localhost:${wpport}"\
                      --admin_user=${wpuser}\
                      --admin_password=${wpword}\
            
                    wp core update
            
                    wp language core install ${wplang}
                    wp language core activate ${wplang}
            
                    wp plugin delete\
                      akismet\
                      hello\
            
                    wp plugin install\
                      advanced-custom-fields\
                      \
                      woocommerce\
                      \
                      media-sync\
                      post-duplicator\
                      \
                      create-block-theme\
                      advanced-query-loop\
                      content-blocks-builder\
                      icon-block\
            
                    wp plugin update --all
                    wp plugin activate --all
            
                    wp theme delete\
                      twentytwentyone\
                      twentytwentytwo\
                      
                  '
            `
        ),
        writeFile(
            PATH + '/prunedc',
            `
                #!/bin/sh

                yes | docker container prune
                yes | docker volume prune
            `,
            {mode: 0o755}
        ),
        writeFile(
            PATH + '/prunedb',
            `
            #!/bin/sh

            yes | rm -R ./${dbslug}/*
            mkdir ./${dbslug}
            touch ./${dbslug}/.gitkeep
            `,
            {mode: 0o755}
        ),
        writeFile(
            PATH + '/prunewp',
            `
            #!/bin/sh

            yes | rm -R ./${wpslug}/*
            mkdir ./${wpslug}
            touch ./${wpslug}/.gitkeep
            `,
            {mode: 0o755}
        ),
        writeFile(
          PATH + '/prune',
          `
          #!/bin/sh

          ./prunedc
          ./prunedb
          ./prunewp
          `,
          {mode: 0o755}
      ),         
    ])

export default INDEX