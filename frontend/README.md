## Сборка

### Development-режим (без заморозки и минимизации)
    cd frontend
    npm i
    node_modules/.bin/bower install
    YENV=development node_modules/.bin/enb make

### Production-режим (с заморозкой и минимизацией)
    cd frontend
    npm i
    node_modules/.bin/bower install
    YENV=production node_modules/.bin/enb make
