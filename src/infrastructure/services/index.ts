import SmsListener from 'react-native-android-sms-listener';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import BackgroundService from 'react-native-background-actions';
import { ForwardSMSUseCase } from '../../application/useCases';

export class SMSService {
  private subscription: any;
  private forwardUseCase: ForwardSMSUseCase;

  constructor(forwardUseCase: ForwardSMSUseCase) {
    this.forwardUseCase = forwardUseCase;
  }

  async requestPermissions(): Promise<boolean> {
    const result = await request(PERMISSIONS.ANDROID.RECEIVE_SMS);
    return result === RESULTS.GRANTED;
  }

  startListening(): void {
    this.subscription = SmsListener.addListener(async (message) => {
      await this.forwardUseCase.execute(message.originatingAddress, message.body);
    });
  }

  stopListening(): void {
    if (this.subscription) {
      this.subscription.remove();
    }
  }
}

export class BackgroundTaskService {
  private smsService: SMSService;

  constructor(smsService: SMSService) {
    this.smsService = smsService;
  }

  async start(): Promise<void> {
    const options = {
      taskName: 'SMS Forwarder',
      taskTitle: 'SMS Forwarder Service',
      taskDesc: 'Listening for SMS and forwarding',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      linkingURI: 'smsforwarder://',
    };

    await BackgroundService.start(this.taskFunction, options);
  }

  async stop(): Promise<void> {
    await BackgroundService.stop();
  }

  private taskFunction = async () => {
    this.smsService.startListening();
    // Keep alive
    while (BackgroundService.isRunning()) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };
}