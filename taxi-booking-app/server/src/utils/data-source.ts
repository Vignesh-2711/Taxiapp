import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Ride } from '../models/Ride';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'taxi.sqlite',
  synchronize: true,
  logging: false,
  entities: [User, Ride],
  migrations: [],
  subscribers: [],
});