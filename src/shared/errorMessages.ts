const errorMessages = {
    common: {
        notFound: 'notFound',
        notAvailable: 'current Service not available',
    },
    auth: {
        invalidCredentials:
            'Invalid username or password. Please check your credentials and try again.',
        userNameNotFound: 'username not found',
        userAlreadyExist: 'username or email is already used',
    },
    hosts: {
        notFound: 'host not found',
        noIdProvided: 'no host id provided',
    },
};

// A LOT OF DUPLICATES STEP UP YOUR GAME SON

export default errorMessages;
