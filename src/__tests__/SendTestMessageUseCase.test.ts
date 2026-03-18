import { SendTestMessageUseCase } from '../application/useCases';
import { IConfigRepository } from '../domain/repositories';

describe('SendTestMessageUseCase', () => {
  let mockConfigRepository: jest.Mocked<IConfigRepository>;
  let useCase: SendTestMessageUseCase;

  beforeEach(() => {
    mockConfigRepository = {
      get: jest.fn(),
      save: jest.fn(),
    };
    useCase = new SendTestMessageUseCase(mockConfigRepository);
  });

  it('should fail on API error', async () => {
    mockConfigRepository.get.mockResolvedValue({ botToken: 'token', chatId: 'chat' });
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, json: () => ({ ok: false, description: 'Bad Request' }) }));

    const result = await useCase.execute();

    expect(result).toEqual({ success: false, message: 'Bad Request' });
  });

  it('should fail on network error', async () => {
    mockConfigRepository.get.mockResolvedValue({ botToken: 'token', chatId: 'chat' });
    global.fetch = jest.fn(() => Promise.reject(new Error('Connection failed')));

    const result = await useCase.execute();

    expect(result).toEqual({ success: false, message: 'Connection failed' });
  });
});