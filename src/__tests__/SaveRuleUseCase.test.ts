import { SaveRuleUseCase } from '../application/useCases';
import { IRuleRepository } from '../domain/repositories';

describe('SaveRuleUseCase', () => {
  let mockRepository: jest.Mocked<IRuleRepository>;
  let useCase: SaveRuleUseCase;

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new SaveRuleUseCase(mockRepository);
  });

  it('should save a rule', async () => {
    const rule = { id: '1', name: 'Test', field: 'sender' as const, pattern: 'test', isRegex: false, isActive: true };

    await useCase.execute(rule);

    expect(mockRepository.save).toHaveBeenCalledWith(rule);
  });
});