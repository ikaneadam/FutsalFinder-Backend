type AsyncFunction<T> = () => Promise<T>;
type SyncFunction<T> = () => T;
type result<T> = [null, T] | [Error, null];

async function handleAsyncOperation<T>(asyncFunction: AsyncFunction<T>): Promise<result<T>> {
    try {
        const response = await asyncFunction();
        return [null, response];
    } catch (error) {
        return [error as Error, null];
    }
}

function handleSyncOperation<T>(syncFunction: SyncFunction<T>): result<T> {
    try {
        const response = syncFunction();
        return [null, response];
    } catch (error) {
        return [error as Error, null];
    }
}

export { handleAsyncOperation, handleSyncOperation };
