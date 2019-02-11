import * as bodyParser from 'body-parser';
import { config } from './config';

// Import dependencies
const express = require('express');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => res.status(200).json({ message: `Application is running on ${config.PORT}.` }));

app.use((req, res, next) => {
    res.status(404)
        .json({ error: 'Sorry! Endpoint not found' });
    next();
});

app.use((err, req, res, next) => {
    const sc = err.status || 500;
    res.status(sc);
});

export { app };