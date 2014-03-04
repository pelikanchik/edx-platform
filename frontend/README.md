## Заготовка для создания БЭМ-проекта

### Как создать свой проект
    git clone git://github.yandex-team.ru/lego/lego-project-stub.git my-pretty-project
    cd my-pretty-project
    rm -rf .git
    git init

### Как пользоваться

#### Получить npm-зависимости
    npm i

#### Получить БЭМ-зависимости
    bem make libs

#### Собрать/Пересобрать проект
    bem make

#### Запустить bem server
    bem server

#### Собрать/Пересобрать один бандл
    bem make desktop.bundles/узел

#### Очистить собранные бандлы
    bem make -m clean

### Помощь
    Задавать вопросы и оставлять пожелания можно в рассылке lego-dev@
