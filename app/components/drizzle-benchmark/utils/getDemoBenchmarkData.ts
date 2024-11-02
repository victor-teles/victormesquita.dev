import data from '../data/demoData.json';
import { type IData } from '../types';
import dataMapper from './dataMapper';

const getDemoBenchmarkData = (): null | {
  drizzleData: IData[];
  compareData: IData[];
} => {
  return {
    drizzleData: dataMapper(data['drizzle-bun']),
    compareData: dataMapper(data['prisma-bun']),
  };
};

export default getDemoBenchmarkData;
