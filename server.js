
const express = require('express');
const port = process.env.PORT || 5000;
// const dotenv = require('dotenv').config();
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.listen(port, () => 
`Server is running on the port ${port}!
-------------------------------------------------------------------------`)