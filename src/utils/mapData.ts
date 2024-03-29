import { ResponseMapFunc } from './updateDbMap';

type data = {
  [key: string]: any;
};

export default function mapData<T>(
  data: data,
  mapFunction: ResponseMapFunc<T>,
) {
  return data.map(mapFunction);
}
