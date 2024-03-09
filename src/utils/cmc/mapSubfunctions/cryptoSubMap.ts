export function cryptoSubMap(
  subdata: CryptocurrencyData & { name: string },
): CryptoMapRecord {
  return [subdata.name, { id: subdata.id }];
}

type CryptocurrencyData = {
  id: number;
};
export type CryptoMapRecord = [string, CryptocurrencyData];
