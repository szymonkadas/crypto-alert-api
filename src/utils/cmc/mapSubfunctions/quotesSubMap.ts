export function quotesSubMap(
  subdata: QuotesData & { id: number },
): QuotesMapRecord {
  return [
    subdata.id,
    {
      name: subdata.name,
      quote: subdata.quote,
      last_updated: subdata.last_updated,
    },
  ];
}

export type QuotesData = {
  name: string;
  quote: { [key: string]: { price: number } };
  last_updated: string;
};
export type QuotesMapRecord = [number, QuotesData];
