export default function (interval: number) {
    return (target: object, _: string, descriptor: PropertyDescriptor) => {
        descriptor.value = debounce(descriptor.value, interval, target);
    };
}

function debounce<F extends ((...args: any[]) => any)>(fn: F, interval: number, $this: object): Function {
    let resolvers = [], rejecters = [], timeout = null;

    return (...args: any[]) => {
        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            try {
                let result = await fn.apply($this, args);
                resolvers.forEach(resolve => resolve(result));
            } catch (err) {
                rejecters.forEach(reject => reject(err));
            }

            resolvers = [];
            rejecters = [];
        }, interval);

        return new Promise((resolve, reject) => {
            resolvers.push(resolve);
            rejecters.push(reject);
        });
    };
}
