import type { AnyFunction, FilterFirstArgument, ValuePromise } from './types';

export function multiTenantMethod<T extends AnyFunction>(method: T) {
    return (context: any) => {
        function getArgs([_first, ...rest]: Parameters<T>) {
            return rest as FilterFirstArgument<T>;
        }
        function proxyFunction(...args: ReturnType<typeof getArgs>): ValuePromise<ReturnType<T>> {
            if (typeof method === 'function') {
                return method.call(context, ...args) as ValuePromise<ReturnType<T>>;
            }
            throw new Error('No Such function');
        }
        return {
            getArgs,
            proxyFunction,
        };
    };
}
