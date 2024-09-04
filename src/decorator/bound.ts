export default function () {
    return (target: object, method: string): void => {
        target[method] = target[method].bind(target);
    };
}
