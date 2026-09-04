import * as env from 'env-var';

export enum Type {
  string,
  boolean,
  int,
}

type ConfigOptions = {
  default?: any;
  type?: Type;
  required?: boolean;
};

export function getConfig(param: string, options: ConfigOptions & { type: Type.boolean }): boolean;
export function getConfig(param: string, options: ConfigOptions & { type: Type.int }): number;
export function getConfig(param: string, options?: ConfigOptions): string;
export function getConfig(param: string, options?: ConfigOptions) {
  // eslint-disable-next-line no-underscore-dangle
  const runtimeValue = typeof window !== 'undefined' ? window._env_?.[param] : undefined;
  const viteValue = import.meta.env[param];
  const configuredValue =
    runtimeValue !== undefined && runtimeValue !== '' ? runtimeValue : viteValue;

  return configuredValue !== undefined && configuredValue !== ''
    ? getVarFromRuntime(param, configuredValue, options)
    : getVarFromEnvironment(param, options);
}

function getVarFromEnvironment(param: string, options?: ConfigOptions) {
  return parseValue(env.get(param), options);
}

function getVarFromRuntime(param: string, runtimeValue: string, options?: ConfigOptions) {
  return parseValue(env.from({ [param]: runtimeValue }).get(param), options);
}

function parseValue(variable: ReturnType<typeof env.get>, options?: ConfigOptions) {
  const requiredValue = variable.required(options?.required ?? false);
  const defaultValue =
    typeof options?.default === 'boolean' ? options.default.toString() : options?.default;
  const value = defaultValue !== undefined ? requiredValue.default(defaultValue) : requiredValue;
  if (Type.int === options?.type) {
    return value.asInt();
  }
  if (Type.boolean === options?.type) {
    return value.asBool();
  }
  return value.asString();
}
