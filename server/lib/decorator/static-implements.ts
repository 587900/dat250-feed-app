'use strict';

//https://stackoverflow.com/questions/13955157/how-to-define-static-property-in-typescript-interface
export default function StaticImplements<T>() { return <U extends T>(constructor: U) => {constructor} }