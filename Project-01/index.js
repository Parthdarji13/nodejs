const express = require('express');
const users = require('./MOCK_DATA.json');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const PORT = 8000;

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB connected!'))
.catch((err) => console.log('Error:', err));

//schema

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true }
});

const User = mongoose.model('User', userSchema);

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
    fs.appendFile("log.txt", `${new Date().toISOString()}: ${req.method}: ${req.path}\n`, (err,data) => {
        next();
    }
);
});

// app.use((req, res, next) => {
//     console.log("hello from middleware 1");
//     // return res.json({ msg: "hello from middleware 1" });
//     next();
// });

//routes

app.get('/users', (req, res) => {
const html = `
    <ul>
        ${users.map(user => `<li>${user.first_name} ${user.last_name}</li>`).join('')}
    </ul>    
`;

    res.send(html);
});

//rest api

app.get('/api/users', async (req, res) => {
    const users = await User.find();
    return res.json(users);
});

app
    .route('/api/users/:id')
    .get((req, res) => {
    const Id = Number(req.params.id);
    const user = users.find((user) => user.id === Id);
    
        if (!user) {
        return res.status(404).json({ status: 'User not found' });
    }

    return res.json(user);
})
   .patch((req, res) => {
    const Id = Number(req.params.id);
    const index = users.findIndex(user => user.id === Id);
    users[index] = { ...users[index], ...req.body };
    return res.json({ status: 'User updated', user: users[index] });
})

.delete((req, res) => {
    const Id = Number(req.params.id);
    const index = users.findIndex(user => user.id === Id);

    // check if user exists
    if (index === -1) {
        return res.status(404).json({ status: 'User not found' });
    }

    users.splice(index, 1);
    return res.json({ status: 'User deleted' });
});


    // saves to MOCK_DATA.json

// app.post('/api/users', (req, res) => {
//     const body = req.body;
//     const newUser = { id: users.length + 1, ...body };
//     users.push(newUser);
//     fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users));
//     return res.status(201).json({ status: 'User created', user: newUser });
// });

// — saves to MongoDB
app.post('/api/users', async (req, res) => {
    const body = req.body;
    try {
        const newUser = await User.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
        });
        return res.status(201).json({ status: 'User created', user: newUser });
    } catch (err) {
        return res.status(500).json({ status: 'Error', error: err.message });
    }
});

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });