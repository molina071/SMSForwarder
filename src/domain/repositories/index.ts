import { Rule } from '../entities';

export interface IRuleRepository {
  getAll(): Promise<Rule[]>;
  save(rule: Rule): Promise<void>;
  update(rule: Rule): Promise<void>;
  delete(id: string): Promise<void>;
}

import { SMS } from '../entities';

export interface ISMSRepository {
  getLast(count: number): Promise<SMS[]>;
  save(sms: SMS): Promise<void>;
}

import { Config } from '../entities';

export interface IConfigRepository {
  get(): Promise<Config | null>;
  save(config: Config): Promise<void>;
}