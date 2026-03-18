import AsyncStorage from '@react-native-async-storage/async-storage';
import { IRuleRepository, Rule } from '../../domain/repositories';

export class AsyncStorageRuleRepository implements IRuleRepository {
  private readonly key = 'rules';

  async getAll(): Promise<Rule[]> {
    const data = await AsyncStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  async save(rule: Rule): Promise<void> {
    const rules = await this.getAll();
    rules.push(rule);
    await AsyncStorage.setItem(this.key, JSON.stringify(rules));
  }

  async update(rule: Rule): Promise<void> {
    const rules = await this.getAll();
    const index = rules.findIndex(r => r.id === rule.id);
    if (index !== -1) {
      rules[index] = rule;
      await AsyncStorage.setItem(this.key, JSON.stringify(rules));
    }
  }

  async delete(id: string): Promise<void> {
    const rules = await this.getAll();
    const filtered = rules.filter(r => r.id !== id);
    await AsyncStorage.setItem(this.key, JSON.stringify(filtered));
  }
}

import { ISMSRepository, SMS } from '../../domain/repositories';

export class AsyncStorageSMSRepository implements ISMSRepository {
  private readonly key = 'sms_logs';
  private readonly maxLogs = 50;

  async getLast(count: number): Promise<SMS[]> {
    const data = await AsyncStorage.getItem(this.key);
    const logs: SMS[] = data ? JSON.parse(data) : [];
    return logs.slice(-count).map(log => ({ ...log, timestamp: new Date(log.timestamp) }));
  }

  async save(sms: SMS): Promise<void> {
    const logs = await this.getLast(this.maxLogs);
    logs.push(sms);
    if (logs.length > this.maxLogs) {
      logs.shift();
    }
    await AsyncStorage.setItem(this.key, JSON.stringify(logs));
  }
}

import { IConfigRepository, Config } from '../../domain/repositories';

export class AsyncStorageConfigRepository implements IConfigRepository {
  private readonly key = 'config';

  async get(): Promise<Config | null> {
    const data = await AsyncStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }

  async save(config: Config): Promise<void> {
    await AsyncStorage.setItem(this.key, JSON.stringify(config));
  }
}