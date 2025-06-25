export function fiatSubMap(subdata): FiatMapRecord {
  return [
    subdata.symbol,
    {
      name: subdata.name,
      sign: subdata.sign,
      id: subdata.id,
    },
  ];
}

type FiatData = {
  name: string;
  sign: string;
  id: number;
};

export type FiatMapRecord = [string, FiatData];
