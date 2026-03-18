import { CheckRulesUseCase } from '../application/useCases';
import { Rule } from '../domain/entities';

class MockRuleRepository {
  private rules: Rule[] = [];

  async getAll(): Promise<Rule[]> {
    return this.rules;
  }

  setRules(rules: Rule[]) {
    this.rules = rules;
  }
}

describe('CheckRulesUseCase', () => {
  it('should return true if SMS matches an active rule', async () => {
    const mockRepo = new MockRuleRepository();
    mockRepo.setRules([
      { id: '1', name: 'Test', field: 'body', pattern: 'test', isRegex: false, isActive: true }
    ]);
    const useCase = new CheckRulesUseCase(mockRepo);

    const result = await useCase.execute({ sender: '123', body: 'this is a test' });
    expect(result).toBe(true);
  });

  it('should return false if no active rules match', async () => {
    const mockRepo = new MockRuleRepository();
    mockRepo.setRules([
      { id: '1', name: 'Test', field: 'body', pattern: 'test', isRegex: false, isActive: false }
    ]);
    const useCase = new CheckRulesUseCase(mockRepo);

    const result = await useCase.execute({ sender: '123', body: 'hello' });
    expect(result).toBe(false);
  });
});