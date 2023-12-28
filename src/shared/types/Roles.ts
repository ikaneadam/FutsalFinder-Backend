enum Roles {
    admin = 'admin',
    host = 'hostUser',
    user = 'user',
}

function isAdminUser(userRoles: Roles[]): boolean {
    return userRoles.includes(Roles.admin);
}

function isDefaultUser(userRoles: Roles[]): boolean {
    return !isAdminUser(userRoles) && userRoles.includes(Roles.user);
}

export { Roles, isAdminUser, isDefaultUser };
