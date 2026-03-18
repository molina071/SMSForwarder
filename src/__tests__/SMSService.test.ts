import { SMSService } from '../infrastructure/services';
import SmsListener from 'react-native-android-sms-listener';
import { request, PERMISSIONS } from 'react-native-permissions';

const mockSmsListener = SmsListener as jest.Mocked<typeof SmsListener>;
const mockPermissions = request as jest.MockedFunction<typeof request>;

describe('SMSService', () => {
  let service: SMSService;
  let mockForwardUseCase: any;

  beforeEach(() => {
    mockForwardUseCase = {
      execute: jest.fn(),
    };
    service = new SMSService(mockForwardUseCase);
    mockSmsListener.addListener.mockClear();
  });

  it('should request permissions', async () => {
    mockPermissions.mockResolvedValue('granted');

    const result = await service.requestPermissions();

    expect(result).toBe(true);
    expect(mockPermissions).toHaveBeenCalledWith(PERMISSIONS.ANDROID.RECEIVE_SMS);
  });

  it('should start listening', () => {
    const mockSubscription = { remove: jest.fn() };
    mockSmsListener.addListener.mockReturnValue(mockSubscription);

    service.startListening();

    expect(mockSmsListener.addListener).toHaveBeenCalled();
  });
});