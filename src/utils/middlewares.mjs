import { mockUsers } from "./constants.mjs";

export const resolveUserByIndexId = (request, response, next) => {
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

 //New middleware, the next argument is something you call when you are done with the middleware
// Middleware NEED to be registered before a route
export const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
}