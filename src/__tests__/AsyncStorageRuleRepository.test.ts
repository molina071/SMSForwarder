import { AsyncStorageRuleRepository } from '../infrastructure/repositories';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('AsyncStorageRuleRepository', () => {
  let repository: AsyncStorageRuleRepository;

  beforeEach(() => {
    repository = new AsyncStorageRuleRepository();
    mockAsyncStorage.getItem.mockClear();
    mockAsyncStorage.setItem.mockClear();
  });

  it('should get all rules', async () => {
    const rules = [{ id: '1', name: 'Test', field: 'sender' as const, pattern: 'test', isRegex: false, isActive: true }];
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(rules));

    const result = await repository.getAll();

    expect(result).toEqual(rules);
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('rules');
  });

  it('should save a rule', async () => {
    const rule = { id: '1', name: 'Test', field: 'sender' as const, pattern: 'test', isRegex: false, isActive: true };
    mockAsyncStorage.getItem.mockResolvedValue('[]');

    await repository.save(rule);

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('rules', JSON.stringify([rule]));
  });

  it('should update a rule', async () => {
    const existingRule = { id: '1', name: 'Old', field: 'sender' as const, pattern: 'old', isRegex: false, isActive: true };
    const updatedRule = { id: '1', name: 'New', field: 'sender' as const, pattern: 'new', isRegex: false, isActive: true };
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify([existingRule]));

    await repository.update(updatedRule);

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('rules', JSON.stringify([updatedRule]));
  });

  it('should delete a rule', async () => {
    const rules = [
      { id: '1', name: 'Test1', field: 'sender' as const, pattern: 'test1', isRegex: false, isActive: true },
      { id: '2', name: 'Test2', field: 'sender' as const, pattern: 'test2', isRegex: false, isActive: true }
    ];
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(rules));

    await repository.delete('1');

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('rules', JSON.stringify([rules[1]]));
  });
});