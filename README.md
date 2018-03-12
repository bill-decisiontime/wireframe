# wireframe

Follow these steps to setup locally:

- install [nodejs](https://nodejs.org/en/)
- install [sass](https://sass-lang.com/install)
- open terminal in the project's document root and run `npm install`
- start the server with mac - `DEBUG=wireframe:* npm start`, windows - `set DEBUG=myapp:* & npm start`
- start sass watching our sass files with `npm run watch-scss`
- intstall livereload browser [extension](http://livereload.com/extensions/)

the following env variables can be set in a `.env` file in the application root:
 - `NODE_ENV` default value is `development`
 - `PORT` the port the application will listen on default value is `3000`
