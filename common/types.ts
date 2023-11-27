'use strict';

type KeyValuePair<T> = { [key : string] : T }
type KeyToValue<K extends string | number, V> = {
    [key in K]: V;
};

export { KeyValuePair, KeyToValue };