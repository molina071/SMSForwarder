import { GetRulesUseCase } from '../application/useCases';
import { IRuleRepository } from '../domain/repositories';

describe('GetRulesUseCase', () => {
  let mockRepository: jest.Mocked<IRuleRepository>;
  let useCase: GetRulesUseCase;

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetRulesUseCase(mockRepository);
  });

  it('should get all rules', async () => {
    const rules = [{ id: '1', name: 'Test', field: 'sender' as const, pattern: 'test', isRegex: false, isActive: true }];
    mockRepository.getAll.mockResolvedValue(rules);

    const result = await useCase.execute();

    expect(result).toEqual(rules);
    expect(mockRepository.getAll).toHaveBeenCalled();
  });
});