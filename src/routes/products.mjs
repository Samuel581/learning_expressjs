import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";
import Product from "../mongoose/schemas/products.mjs";
const router = Router();

router.post('/products',
    async (request, response) => {
        const {body} = request;
        const newProduct = new Product(body);
        try {
            const savedProduct = await newProduct.save();
            return response.status(201).send(savedProduct);
        } catch (error) {
            console.log(error);
            return response.sendStatus(400);
        }
    })

router.get('/products', (request, response) => {
    console.log(request.headers.cookie);;
    console.log(request.cookies);
    if (request.cookies.hello && request.cookies.hello === 'world')
        return response.send([{ id: 123, name: 'chicken', price: 5.75 }]);
    return response.send({ msg: 'Sorry, you need the correct cookie' });
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