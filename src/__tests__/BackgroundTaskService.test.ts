import { BackgroundTaskService } from '../infrastructure/services';
import BackgroundService from 'react-native-background-actions';

const mockBackgroundService = BackgroundService as jest.Mocked<typeof BackgroundService>;

describe('BackgroundTaskService', () => {
  let service: BackgroundTaskService;
  let mockSmsService: any;

  beforeEach(() => {
    mockSmsService = {
      startListening: jest.fn(),
    };
    service = new BackgroundTaskService(mockSmsService);
    mockBackgroundService.start.mockClear();
    mockBackgroundService.stop.mockClear();
  });

  it('should start background service', async () => {
    mockBackgroundService.start.mockResolvedValue(undefined);

    await service.start();

    expect(mockBackgroundService.start).toHaveBeenCalled();
  });

  it('should stop background service', async () => {
    await service.stop();

    expect(mockBackgroundService.stop).toHaveBeenCalled();
  });
});