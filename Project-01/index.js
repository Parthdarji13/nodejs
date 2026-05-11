const express = require('express');
const users = require('./MOCK_DATA.json');
const fs = require('fs');

const app = express();
const PORT = 8000;

app.use(express.json());

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

app.get('/api/users', (req, res) => {
    res.json(users);
});

app
    .route('/api/users/:id')
    .get((req, res) => {
    const Id = Number(req.params.id);
    const user = users.find((user) => user.id === Id);
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

app.post('/api/users', (req, res) => {
    const body = req.body;
    const newUser = { id: users.length + 1, ...body };
    users.push(newUser);

    // save to json file
    fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users));

    return res.json({ status: 'User created', user: newUser });
});

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });