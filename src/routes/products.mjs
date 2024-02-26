import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";
const router = Router();

router.get('/products', (request, response) => {
    console.log(request.query);
    response.send(mockProducts)
});

//Using params
router.get('/products/:id', (request, response) => {
    const parseId = parseInt(request.params.id);
    if (isNaN(parseId)) return response.status(400).send({ msg: 'Bad Request. Invalid ID' });
    const findProduct = mockProducts.find((product) => product.id === parseId)
    if (!findProduct) return response;
    return response.send(findProduct);
})

export default router;