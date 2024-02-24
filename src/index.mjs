import express from 'express';
import dotenv from 'dotenv';
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator'
import { createUserValidationSchema } from './utils/validationSchemas.mjs';
import  usersRouter  from './routes/users.mjs';
import { mockUsers } from './utils/constants.mjs';

dotenv.config({ path: '.env' });

const app = express();

//Middleware
app.use(express.json())
app.use(usersRouter)

//New middleware, the next argument is something you call when you are done with the middleware
// Middleware NEED to be registered before a route
const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
}

const resolveUserByIndexId = (request, response, next) => {
    const {
        body,
        params: { id }
    } = request;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
    if (findUserIndex === -1) return response.sendStatus(404);
    request.findUserIndex = findUserIndex;
    next();
}


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


app.get('/', loggingMiddleware, (request, response, next) => {
    console.log('Base URL');
    next();
}, (request, response) => {
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


app.post('/api/users',
    checkSchema(createUserValidationSchema),
    (request, response) => {
        const result = validationResult(request)

        if (!result.isEmpty())
            return response.status(400).send({ errors: result.array() });

        const data = matchedData(request);
        console.log(data);


        const { body } = request;
        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
        mockUsers.push(newUser);

        return response.send(newUser).status(200);
    })


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

//PUT -> Update all of something (for example here, an user)

app.put('/api/users/:id', resolveUserByIndexId, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(200);

})

//PATCH -> Update just a portion of something (for example here, an username of an user and just that)

app.patch('/api/users/:id', resolveUserByIndexId, (request, response) => {
    const { body, findUserIndex } = request;
    // Here we get the entire object and it's values and then we override it using the body we sent
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }
    // The return line
    return response.sendStatus(200);
})

//DELETE -> This one explains itself
//Tipically you don't need to add a body to the request 
//You can, but it's not common

app.delete('/api/users/:id', resolveUserByIndexId, (request, response) => {
    // Splice with a counter number for deleting just one user/object
    mockUsers.splice(request.findUserIndex, 1);
    return response.sendStatus(200);
})

