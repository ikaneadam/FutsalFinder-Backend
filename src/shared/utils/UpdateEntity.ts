export function updateEntityKey<T, K extends keyof T>(
    entityToUpdate: T,
    keyToUpdate: K,
    keyToUpdateWith?: T[K]
) {
    if (keyToUpdateWith !== undefined) {
        entityToUpdate[keyToUpdate] = keyToUpdateWith;
    }
}

export function updateEntity<T>(
    entityToUpdate: T,
    updateSchema: { [K in keyof T]?: T[K] | any }
): void {
    for (const key in updateSchema) {
        const updateValue = updateSchema[key];
        if (Array.isArray(entityToUpdate[key])) {
            entityToUpdate[key] = updateValue;
            continue;
        }

        if (
            typeof updateValue === 'object' &&
            updateValue !== null &&
            !Array.isArray(updateValue)
        ) {
            if (entityToUpdate[key] === null || typeof entityToUpdate[key] !== 'object') {
                entityToUpdate[key] = {} as T[Extract<keyof T, string>];
            }
            updateEntity(entityToUpdate[key], updateValue);
        } else {
            updateEntityKey(entityToUpdate, key as keyof T, updateValue);
        }
    }
}
