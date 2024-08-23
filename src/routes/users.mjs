import { response, Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveUserByIndexId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../helpers/hashPassword.mjs";

const router = Router();

router.get('/users', async (request, response) => {
    try {
        const users = await User.find();
        return response.status(200).send(users);
    }
    catch (err) {
        console.log(err);
        return response.status(400).send(err);
    }
});

router.post('/users',
    checkSchema(createUserValidationSchema),
    async (request, response) => {
        const result = validationResult(request);
        if (!result.isEmpty()) return response.status(400).send(result.array());
        const {body} = request;
        console.log(body);
        body.password = hashPassword(body.password);
        const newUser = new User(body);
        try {
            const savedUser = await newUser.save();
            return response.status(201).send(savedUser);
        } catch (err) {
            return response.sendStatus(400);
        }
    }
);


//PUT -> Update all of something (for example here, an user)

router.put('/users/:id', resolveUserByIndexId, (request, response) => {
    const { body, findUserIndex } = request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.sendStatus(200);

})


//PATCH -> Update just a portion of something (for example here, an username of an user and just that)

router.patch('/users/:id', resolveUserByIndexId, (request, response) => {
    const { body, findUserIndex } = request;
    // Here we get the entire object and it's values and then we override it using the body we sent
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body }
    // The return line
    return response.sendStatus(200);
})

//DELETE -> This one explains itself
//Tipically you don't need to add a body to the request 
//You can, but it's not common

router.delete('/users/:id', resolveUserByIndexId, (request, response) => {
    // Splice with a counter number for deleting just one user/object
    mockUsers.splice(request.findUserIndex, 1);
    return response.sendStatus(200);
})


export default router;