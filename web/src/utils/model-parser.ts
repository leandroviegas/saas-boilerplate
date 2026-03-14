export function parseModel<T, M>(
  data: T,
  Model: new (data: T) => M
): M {
  return new Model(data);
}

export function parseModels<T, M>(
  data: T[],
  Model: new (data: T) => M
): M[] {
  return data.map(d => new Model(d));
}
