import { AxiosResponse } from 'axios';

type FiatData = {
  name: string;
  sign: string;
  id: number;
};
export type FiatMap = Map<string, FiatData>;

export default function mapFiat(response: AxiosResponse<any, any>) {
  const data = response.data.data;
  const mappedResponse: [string, FiatData][] = [];
  // map response
  data.forEach((subdata) => {
    mappedResponse.push([
      subdata.symbol,
      { name: subdata.name, sign: subdata.sign, id: subdata.id },
    ]);
  });
  return mappedResponse;
}
