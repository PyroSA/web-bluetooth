import express from 'express';

const PORT = 3000;

const app = express();
app.use(express.static('./docs/'));
app.listen(PORT, () => {
  console.log('app listening on port', PORT);
});
