import { AsyncStorageSMSRepository } from '../infrastructure/repositories';
import AsyncStorage from '@react-native-async-storage/async-storage';

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('AsyncStorageSMSRepository', () => {
  let repository: AsyncStorageSMSRepository;

  beforeEach(() => {
    repository = new AsyncStorageSMSRepository();
    mockAsyncStorage.getItem.mockClear();
    mockAsyncStorage.setItem.mockClear();
  });

  it('should get last SMS logs', async () => {
    const logs = [
      { id: '1', sender: 'sender1', body: 'body1', timestamp: new Date(), status: 'forwarded' as const },
      { id: '2', sender: 'sender2', body: 'body2', timestamp: new Date(), status: 'filtered' as const }
    ];
    mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(logs));

    const result = await repository.getLast(10);

    expect(result).toEqual(logs);
  });

  it('should save SMS log', async () => {
    const sms = { id: '1', sender: 'sender', body: 'body', timestamp: new Date(), status: 'forwarded' as const };
    mockAsyncStorage.getItem.mockResolvedValue('[]');

    await repository.save(sms);

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('sms_logs', JSON.stringify([sms]));
  });
});