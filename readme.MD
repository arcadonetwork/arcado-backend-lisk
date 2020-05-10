# Setup
Start wit installing dependencies:
```
npm install
```

Next, start the development server with `nodemon` as a dev dependency using:
```
npm run dev
```

# Environment
Make sure to create a `.env` file that hides any secrets.
Currently, not much secret going on. The PORT for the Express app can be changed via the `.env` file.

```
PORT=<number> DEFAULT: 3000
GENESIS=<string> DEFAULT: wagon stock borrow episode laundry kitten salute link globe zero feed marble
```