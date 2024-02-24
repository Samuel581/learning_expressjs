import { Router } from "express";
import { query, validationResult } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";

const router = Router();

router.get('/api/users',
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

export default router;