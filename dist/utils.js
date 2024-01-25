export function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            const baseCtorName = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);
            if (!baseCtorName) {
                return;
            }
            Object.defineProperty(derivedCtor.prototype, name, baseCtorName);
        });
    });
}
export const ORDER_BY_SELECTION = ['score', 'referral'];
