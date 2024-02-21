import express, { request, response } from 'express';
import dotenv, { parse } from 'dotenv';

dotenv.config({ path: '.env' });

const app = express();

//Middleware
app.use(express.json())



const PORT = process.env.PORT;
const mockProducts = [
    { id: 1, name: 'Milk 2 Liters', price: 2.50 },
    { id: 2, name: 'Potato Snakcs', price: 1.50 },
    { id: 3, name: 'Coca Cola', price: 1.00 },
    { id: 4, name: 'Bread', price: 0.50 },
    { id: 5, name: 'Eggs', price: 1.00 },
    { id: 6, name: 'Butter', price: 1.50 },
    { id: 7, name: 'Cheese', price: 2.00 },
];
const mockUsers = [
    { id: 1, name: 'John Doe', displayName: 'Jonh' },
    { id: 2, name: 'Jane Doe', displayName: 'Jane' },
    { id: 2, name: 'Lucas Melor', displayName: 'Lucas' },
];

app.get('/', (request, response) => {
    response.status(201).send({ msg: 'Hello World' });
})

app.get('/api/products', (request, response) => {
    console.log(request.query);
    response.send(mockProducts)
});

//Using params
app.get('/api/products/:id', (request, response) => {
    const parseId = parseInt(request.params.id);
    if (isNaN(parseId)) return response.status(400).send({ msg: 'Bad Request. Invalid ID' });

    const findProduct = mockProducts.find((product) => product.id === parseId)

    if (!findProduct) return response;

    return response.send(findProduct);
})

//God knows LMAO
app.get('/api/users', (request, response) => {
    console.log(request.query);
    const { filter, value } = request.query;

    if (filter && value) {
        return response.send(
            mockUsers.filter((user) => 
                user[filter] && user[filter].toString().toLowerCase().includes(value.toLowerCase()))
        );
    }

    response.send(mockUsers);
});

app.post('/api/users', (request, response) => {
    const {body} = request;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body};
    mockUsers.push(newUser);
    return response.send(newUser).status(200);
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

//PUT -> Update all of something (for example here, an user)

app.put('/api/users/:id', (request, response)=>{
    const {body, params: {id}} = request;

    const parsedId = parseInt(id);

    if(isNaN(parsedId)) return response.sendStatus(400);

    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

    if (findUserIndex === -1) return response.sendStatus(404);

    mockUsers[findUserIndex] = { id: parsedId, ...body};
    return response.sendStatus(200);

})

//PATCH -> Update just a portion of something (for example here, an username of an user and just that)

app.patch('api/users/:id', (request, response) => {
    
})

//DELETE -> This one explains itself


