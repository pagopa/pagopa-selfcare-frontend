import * as env from "env-var";

export enum Type {
    string,
    boolean,
    int
}

export function getConfig(param: string, options?: { default?: any; type?: Type; required?: boolean }) {

    // eslint-disable-next-line no-underscore-dangle

    const actual_environment = env.get('REACT_APP_ENV').required().asString();
    /*eslint-disable */
    if (actual_environment === "prod" || (!("_env_" in window) || !(window as any)._env_[param])) {
        return getVarFromEnvironment(param, options);
    }
    return getVarFromWindow(param, options);
}

function getVarFromEnvironment(param: string, options?: { default?: any; type?: Type; required?: boolean }) {
    let value = env.get(param)
        .required(options?.required ?? false);
    if (options?.default) {
        value = value.default(options.default);
    }
    if (Type.int === options?.type) {
        return value.asInt()
    }
    if (Type.boolean === options?.type) {
        return value.asBool()
    }
    return value.asString();
}

function getVarFromWindow(param: string, options?: { default?: any; type?: Type; required?: boolean }) {
    if (Type.int === options?.type) {
        return +((window as any)._env_[param])
    }
    if (Type.boolean === options?.type) {
        return (window as any)._env_[param] === "true"
    }
    return (window as any)._env_[param].toString();
}
