const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');


// users hardcoded for simplicity, store in a db for production applications
const users = [
    { id: 1, username: 'kawish', password: 'kawish123', firstName: 'Kawish', lastName: 'Abbas', role: Role.Admin },
    { id: 2, username: 'mujtaba', password: 'mujtaba123', firstName: 'Mujtaba', lastName: 'Zaidi', role: Role.User },
    { id: 3, username: 'arsalan', password: 'arsalan123', firstName: 'Arsalan', lastName: 'Gay', role: Role.SouthDEV }
];

module.exports = {
    authenticate,
    getAll,
    getSouthDev,
    getById,
  
};

async function authenticate({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

async function getSouthDev() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

async function getById(id) {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
