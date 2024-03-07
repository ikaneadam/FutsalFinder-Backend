import dotenv from 'dotenv';

dotenv.config();

const express = require('express');
const app = express();
const port = Number(process.env.PORT) || 65036;

app.get('/', (req: any, res: any) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
