import connectToMongo from './db';
import express, { json } from 'express';
import User from './models/User';
import Note from './models/Note';
import cors from 'cors';



connectToMongo();
const app = express()
const port = 5000
app.use(json());
app.use(cors())

app.use('/api/auth',require('./routes/auth').default);
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNoteBook app listening on port ${port}`)
})