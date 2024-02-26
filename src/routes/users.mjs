import { Router } from "express";
import { query, validationResult, checkSchema } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveUserByIndexId } from "../utils/middlewares.mjs";

const router = Router();

router.get('/users',
    query('filter')
        .isString()
        .notEmpty()
        .withMessage('Must not be empty') //This is how we poitn the errors, AKA give them a description to easy find
        .isLength({ min: 3, max: 10 })
        .withMessage('Must be 3 to 10 characters'),
    (request, response) => {


        // We get the errors to handle them
        const result = validationResult(request);
        console.log(result);
        const { filter, value } = request.query;
        if (filter && value) {
            return response.send(
                mockUsers.filter((user) => user[filter].includes(value))
            );
        }
        response.send(mockUsers);
    })

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