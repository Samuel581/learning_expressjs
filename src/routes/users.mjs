import { Router } from "express";
import { query, validationResult, checkSchema } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveUserByIndexId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";

const router = Router();

router.get('/users',
    checkSchema(createUserValidationSchema),
    async (request, response) => {
        const result = validationResult(request);
        if(result.isEmpty()) return response.send(result.array());
        const { body } = request;
        const newUser = new User(body);
        try {
            const savedUser = await newUser.save();
            return response.status(201).send(savedUser);
        } catch (err) {
            console.log(err);
            return response.sendStatus(400);
        }
    }

)

router.post('/users',
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