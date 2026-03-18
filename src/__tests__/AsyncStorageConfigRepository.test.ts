import { AsyncStorageConfigRepository } from '../infrastructure/repositories';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('AsyncStorageConfigRepository', () => {
  let repository: AsyncStorageConfigRepository;

  beforeEach(() => {
    repository = new AsyncStorageConfigRepository();
    mockAsyncStorage.getItem.mockClear();
    mockAsyncStorage.setItem.mockClear();
  });

  it('should get config', async () => {
    const config = { botToken: 'token', chatId: 'chat' };
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(config));

    const result = await repository.get();

    expect(result).toEqual(config);
  });

  it('should return null if no config', async () => {
    mockAsyncStorage.getItem.mockResolvedValue(null);

    const result = await repository.get();

    expect(result).toBeNull();
  });

  it('should save config', async () => {
    const config = { botToken: 'token', chatId: 'chat' };

    await repository.save(config);

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('config', JSON.stringify(config));
  });
});