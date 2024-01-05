import { CacheStore } from '@nestjs/common';
import { AxiosResponse } from 'axios';

export default async function mapLatestData(
  response: AxiosResponse<any, any>,
  cacheManager: CacheStore,
) {
  const data = response.data.data;
  const mappedResponse = [];
  // map response
  data.forEach((subdata) => {
    mappedResponse.push([
      subdata.id,
      {
        name: subdata.name,
        quote: subdata.quote,
        lastUpdated: subdata.last_updated,
      },
    ]);
  });
  // save data in cache
  try {
    cacheManager.set('latestQuotesData', mappedResponse);
  } catch (e) {
    console.log('fiat map update failed', e);
  }
  return mappedResponse;
}
