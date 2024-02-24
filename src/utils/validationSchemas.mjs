export const createUserValidationSchema = {
    displayName: {
        isLength: {
            options: {
                min: 5,
                max: 25,
            },
            errorMessage:
                "Displayname must be somewhere between 5 and 25 characters",
        },
        notEmpty: {
            errorMessage: "Displayname cannot be empty"
        },
        isString: {
            errorMessage: "Displayname must be a string!"
        }
    }
}