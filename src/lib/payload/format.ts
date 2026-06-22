export function toPayloadArray(values: string[]) {
  return values.map((value) => ({ interest: value }));
}

export function toTagArray(values: string[]) {
  return values.map((value) => ({ tag: value }));
}
