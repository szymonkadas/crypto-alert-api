import { AxiosResponse } from 'axios';

export default function mapCryptocurrencies(response: AxiosResponse<any, any>) {
  const data = response.data.data;
  const mappedResponse: [string, number][] = [];
  // map response
  data.forEach((subdata) => {
    mappedResponse.push([subdata.name, subdata.id]);
  });
  return mappedResponse;
}
