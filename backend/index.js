//packages
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const app = express();
const categoryRoutes = require('./routes/categoryRoutes');

//routes
const userRoutes = require('./routes/userRoutes');

//utils
const connectDB = require('./config/db');
dotenv.config();
connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//routes
app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);

//listen to server x
const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

//index uses the routes, routes uses the controller, controller uses the model
