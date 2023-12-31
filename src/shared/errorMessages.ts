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
    rooms: {
        notFound: 'rooms not found',
        noIdProvided: 'no room id provided',
    },
    dates: {
        invalidTimeFormat: 'Invalid time format. Please use HH:00 or HH:30',
        invalidDateFormat: 'Invalid start time format. Please use YYYY-MM-DD',
        dateIsNotPossible: 'Given Date does not exist',
        dateMustBeFuture: 'Date must be in the future',
    },
};

// A LOT OF DUPLICATES STEP UP YOUR GAME SON

export default errorMessages;
