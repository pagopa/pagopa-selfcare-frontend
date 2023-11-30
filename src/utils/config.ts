import * as env from "env-var";

export enum Type {
    string = 1,
    boolean,
    int
}
export function getConfig(param: string, options: { default?: any; type?: Type; required?: boolean }) {
    
    // eslint-disable-next-line no-underscore-dangle

    /*eslint-disable */
    if (!("_env_" in window) || !(window as any)._env_[param]) {
        let value = env.get(param)
            .required(options.required ?? false);
        if (options.default){
            value = value.default(options.default);
        }
        if (Type.int === options.type){
            return value.asInt()
        }
        if (Type.boolean === options.type){
            return value.asBool()
        }
        return value.asString();

    }
    // eslint-disable-next-line: no-any
    return (window as any)._env_[param].toString();
}

