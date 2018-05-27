var validations = {};

validations.errorMessages = {
    notLoggedIn: 'You are not logged in',
    dbQueryError: "There has been an error querying the database.",
    emailExist: 'Email already exist in database.',
}

validations.email = {
    char_limit: {
        max: 90,
        min: 1
    },
    notEmptyMessage: 'Email must be entered',
    char_limit_message: "Email length must be between 1 and 90 characters.",
    invalid_message: 'Must be a valid email',
}

validations.name = {
    char_limit: {
        max: 25,
        min: 1
    },
    char_limit_message: 'name must be between 1 to 15 characters',
}

validations.password = {
    char_limit: {
        min: 5
    },
    message: 'Passwords must be at least 5 chars long, contain at least one upper case, one lower case, and one number',
}

validations.gender = {
    char_limit: {
        max: 6,
        min: 1
    },
    message: 'Gender character limit must be between 1 and 6',
}
validations.zipcode = {
    char_limit: {
        max: 10,
        min: 5
    },
    char_limit_message: 'Zipcode must be between 5 to 10 characters long with format 77777 or 77777-0000',
}
validations.height = {
    char_limit: {
        max: 5,
        min: 1
    },
    char_limit_message: 'Height must be between 1 to 5 characters long',
}

validations.dob = {
    char_limit: {
        max: 10,
    },
    char_limit_message: 'Date must be written in MM-DD-YYYY',
}

validations.agepref= {
    char_limit: {
        max: 5,
        min: 1
    },
    char_limit_message: 'Age preference must be between 1 and 5 characters',
}

validations.race = {
    char_limit: {
        max: 25,
    },
    char_limit_message: 'Race cannot exceed 25 characters',
}

validations.religion = {
    char_limit: {
        max: 50,
    },
    char_limit_message: `Religion cannot exceed 50 characters`,
}


module.exports = validations;