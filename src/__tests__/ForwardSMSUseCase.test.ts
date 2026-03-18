import { ForwardSMSUseCase } from '../application/useCases';
import { IRuleRepository, ISMSRepository, IConfigRepository } from '../domain/repositories';

describe('ForwardSMSUseCase', () => {
  let mockRuleRepository: jest.Mocked<IRuleRepository>;
  let mockSMSRepository: jest.Mocked<ISMSRepository>;
  let mockConfigRepository: jest.Mocked<IConfigRepository>;
  let mockCheckRulesUseCase: any;
  let mockSaveSMSLogUseCase: any;
  let useCase: ForwardSMSUseCase;

  beforeEach(() => {
    mockRuleRepository = {
      getAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockSMSRepository = {
      getLast: jest.fn(),
      save: jest.fn(),
    };
    mockConfigRepository = {
      get: jest.fn(),
      save: jest.fn(),
    };
    mockCheckRulesUseCase = {
      execute: jest.fn(),
    };
    mockSaveSMSLogUseCase = {
      execute: jest.fn(),
    };
    useCase = new ForwardSMSUseCase(mockCheckRulesUseCase, mockConfigRepository, mockSaveSMSLogUseCase);
  });

  it('should handle error when config not set', async () => {
    mockCheckRulesUseCase.execute.mockResolvedValue(true);
    mockConfigRepository.get.mockResolvedValue(null);

    await useCase.execute('sender', 'body');

    expect(mockSaveSMSLogUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', errorMessage: 'Config not set' })
    );
  });

  it('should handle Telegram API error', async () => {
    mockCheckRulesUseCase.execute.mockResolvedValue(true);
    mockConfigRepository.get.mockResolvedValue({ botToken: 'token', chatId: 'chat' });
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, json: () => ({ ok: false, description: 'Invalid token' }) }));

    await useCase.execute('sender', 'body');

    expect(mockSaveSMSLogUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', errorMessage: 'Invalid token' })
    );
  });

  it('should handle fetch error', async () => {
    mockCheckRulesUseCase.execute.mockResolvedValue(true);
    mockConfigRepository.get.mockResolvedValue({ botToken: 'token', chatId: 'chat' });
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

    await useCase.execute('sender', 'body');

    expect(mockSaveSMSLogUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'error', errorMessage: 'Network error' })
    );
  });
});