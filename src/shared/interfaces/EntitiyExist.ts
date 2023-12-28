export type ExistenceResult<t> = [true, t] | [false, null];

export function parseEntityToExistenceResult<t>(entity: t | null): ExistenceResult<t> {
    if (doesEntityExist(entity)) {
        return [true, entity];
    }
    return [false, entity];
}

function doesEntityExist<t>(entity: t | null): entity is t {
    return entity !== null;
}
