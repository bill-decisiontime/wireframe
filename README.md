# wireframe

Follow these steps to setup locally:

- install [nodejs](https://nodejs.org/en/)
- install [sass](https://sass-lang.com/install)
- open terminal in the project's document root and run `npm install`
- start the server on mac - `DEBUG=wireframe:* npm run development`, 
- start the server on windows - `set DEBUG=myapp:* & npm run development`
- start sass watching our sass files with `npm run watch-scss`
- intstall livereload browser [extension](http://livereload.com/extensions/)

the following env variables can be set in a `.env` file in the application root:
 - `NODE_ENV` default value is `development`
 - `PORT` the port the application will listen on default value is `3000`
 - `MONGO_DB_URI` mongo db uri the default is `mongodb://localhost:27017/wireframe`
