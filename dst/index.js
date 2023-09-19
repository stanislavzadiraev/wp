import { writeFile } from 'node:fs/promises'

const PATH = process.cwd()

const [UID, GID] = os.userInfo()

const INDEX = ({

    }) =>
    Promise.all([
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
                  MYSQL_DATABASE: base
                  MYSQL_USER: user
                  MYSQL_PASSWORD: word
                user: "${UID}:${GID}"
                volumes:
                  - ./database/:/var/lib/mysql/
            
              phpmyadmin:
                image: phpmyadmin:latest
                restart: always
                depends_on:
                  mysql:
                    condition: service_started
                ports:
                  - 7070:80
                environment:
                  PMA_HOST: mysql
                  PMA_USER: user
                  PMA_PASSWORD: word
            
              wordpress:
                image: wordpress:latest
                restart: always
                depends_on: 
                  mysql:
                    condition: service_started
                ports:
                  - 8080:80
                  user: "${UID}:${GID}"
                volumes:
                  - ./wordpress/:/var/www/html/
            
              wp-cli:    
                image: wordpress:cli
                depends_on:
                  wordpress:
                    condition: service_started
                  mysql:
                    condition: service_started
                user: "${UID}:${GID}"
                volumes:
                  - ./wordpress/:/var/www/html/
            
                command: >
                  /bin/sh -c '
                    sleep 40
            
                    wp config create\
                      --dbhost=mysql\
                      --dbname=base\
                      --dbuser=user\
                      --dbpass=word\
                      --skip-check\
            
                    wp core install\
                      --path="/var/www/html"\
                      --url="http://localhost:8080"\
                      --title="Local Wordpress By Docker"\
                      --admin_user=user\
                      --admin_password=word\
                      --admin_email=foo@bar.com\
            
                    wp core update
            
                    wp language core install ru_RU
                    wp language core activate ru_RU
            
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
            `
        ),
        writeFile(
            PATH + '/prunedb',
            `
            #!/bin/sh

            yes | rm -R ./database/*
            mkdir ./database
            touch ./database/.gitkeep
            `
        ),
        writeFile(
            PATH + '/prunewp',
            `
            #!/bin/sh

            yes | rm -R ./wordpress/*
            mkdir ./wordpress
            touch ./wordpress/.gitkeep
            `
        ),        
    ])

export default INDEX