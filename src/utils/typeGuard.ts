export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export function isAtLeastOnePropertyDefined<T extends object>(obj: T, properties: Array<keyof T>): boolean {
  return properties.some(p => obj.hasOwnProperty(p));
}
