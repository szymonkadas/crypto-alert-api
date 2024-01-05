import { AxiosResponse } from 'axios';

export default function mapQuotesData(response: AxiosResponse<any, any>) {
  const data = response.data.data;
  const mappedResponse = [];
  // map response
  Object.values(data).forEach(
    // this type is kinda simplied (quotes are simplified to only price)
    (subdata: {
      id: number;
      name: string;
      quote: { string: { price: number } };
      last_updated: string;
    }) => {
      mappedResponse.push([
        subdata.id,
        {
          name: subdata.name,
          quote: subdata.quote,
          lastUpdated: subdata.last_updated,
        },
      ]);
    },
  );
  return mappedResponse;
}
