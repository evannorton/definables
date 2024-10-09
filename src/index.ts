import { v4 as uuidv4 } from "uuid";

declare global {
  interface Window {
    definables: Map<string, Map<string, Definable>>;
  }
}

export const definables: Map<string, Map<string, Definable>> = new Map();
if (typeof window !== "undefined") {
  window.definables = definables;
}
const getRandomID = (): string => uuidv4();

export abstract class Definable {
  protected static _createOrderCounter: number = 0;
  protected _createOrder: number;
  protected readonly _id: string;

  public constructor(id?: string) {
    this._id = id ?? getRandomID();
    if (definables.has(this.constructor.name) === false) {
      definables.set(this.constructor.name, new Map());
    }
    const list: Map<string, Definable> | undefined = definables.get(
      this.constructor.name,
    );
    if (list) {
      if (list.has(this._id)) {
        throw new Error(
          `${this.constructor.name} "${this._id}" already exists.`,
        );
      }
      list.set(this._id, this);
    }
    this._createOrder = Definable._createOrderCounter;
    Definable._createOrderCounter++;
  }

  public get id(): string {
    return this._id;
  }

  public getReference(): DefinableReference {
    return {
      className: this.constructor.name,
      id: this._id,
    };
  }

  public remove(): void {
    const definablesMap: Map<string, Definable> | undefined = definables.get(
      this.constructor.name,
    );
    if (typeof definablesMap === "undefined") {
      throw new Error(
        `An attempt was made to remove ${this.constructor.name} "${this._id}" with no existing definables map.`,
      );
    }
    definablesMap.delete(this._id);
  }

  protected getAccessorErrorMessage(property: string): string {
    return `Could not access ${this.constructor.name} "${this._id}" ${property}.`;
  }
}
export interface DefinableReference {
  readonly className: string;
  readonly id: string;
}
export const getDefinables = <T extends Definable>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The args are not relevant to this function.
  prototype: new (...args: any[]) => T,
): ReadonlyMap<string, T> => {
  const retrievedDefinables: Map<string, T> = new Map();
  definables
    .get(prototype.name)
    ?.forEach((definable: Definable, id: string): void => {
      retrievedDefinables.set(id, definable as T);
    });
  return retrievedDefinables;
};
export const getDefinable = <T extends Definable>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The args are not relevant to this function.
  prototype: new (...args: any[]) => T,
  id: string,
): T => {
  const definable: T | undefined = getDefinables(prototype).get(id);
  if (typeof definable === "undefined") {
    throw new Error(`${prototype.name} "${id}" does not exist.`);
  }
  return definable;
};
export const definableExists = <T extends Definable>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The args are not relevant to this function.
  prototype: new (...args: any[]) => T,
  id: string,
): boolean => getDefinables(prototype).has(id);
export const getDefinablesCount = <T extends Definable>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- The args are not relevant to this function.
  prototype: new (...args: any[]) => T,
): number => getDefinables(prototype).size;
