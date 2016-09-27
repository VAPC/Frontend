interface IMemoize {
    (func: Function, equalityCheck?: Function): Function;
}

function memoize(): IMemoize {
    return (func, equalityCheck = defaultEqualityCheck) => {
        let lastArgs = null;
        let lastResult = null;
        return (...args) => {
            if (
                lastArgs !== null &&
                lastArgs.length === args.length &&
                args.every((value, index) => equalityCheck(value, lastArgs[index]))
            ) {
                return lastResult;
            }
            lastArgs = args;
            lastResult = func(...args);
            return lastResult;
        }
    };
}

function defaultEqualityCheck(a, b) {
    return a === b
}

angular
    .module('elvisMobile')
    .factory('memoize', memoize);

