require('dotenv').config();
const express = require('express');
const connection = require('./src/config/database')
const cors = require('cors')
const apiRoutes = require('./src/routes/api')
const cookieParser = require('cookie-parser')

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser());

app.use('/api', apiRoutes)

const startServer = async () => {
    try {
        await connection();
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`)
        })
    } catch (error) {
        console.log('Error connect to DB: ', error)
    }
}
startServer()