## Сборка

    cd frontend
    npm i
    node_modules/.bin/bower install
    YENV=production node_modules/.bin/enb make

## Обновление nodejs

Может случиться, что потребуется обновить версию nodejs:

    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs
