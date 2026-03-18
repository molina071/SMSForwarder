import { IRuleRepository, Rule } from '../../domain/repositories';
import { ISMSRepository, SMS } from '../../domain/repositories';
import { IConfigRepository, Config } from '../../domain/repositories';

export class GetRulesUseCase {
  constructor(private ruleRepository: IRuleRepository) {}

  async execute(): Promise<Rule[]> {
    return this.ruleRepository.getAll();
  }
}

export class SaveRuleUseCase {
  constructor(private ruleRepository: IRuleRepository) {}

  async execute(rule: Rule): Promise<void> {
    await this.ruleRepository.save(rule);
  }
}

export class UpdateRuleUseCase {
  constructor(private ruleRepository: IRuleRepository) {}

  async execute(rule: Rule): Promise<void> {
    await this.ruleRepository.update(rule);
  }
}

export class DeleteRuleUseCase {
  constructor(private ruleRepository: IRuleRepository) {}

  async execute(id: string): Promise<void> {
    await this.ruleRepository.delete(id);
  }
}

export class GetSMSLogsUseCase {
  constructor(private smsRepository: ISMSRepository) {}

  async execute(count: number = 50): Promise<SMS[]> {
    return this.smsRepository.getLast(count);
  }
}

export class SaveSMSLogUseCase {
  constructor(private smsRepository: ISMSRepository) {}

  async execute(sms: SMS): Promise<void> {
    await this.smsRepository.save(sms);
  }
}

export class GetConfigUseCase {
  constructor(private configRepository: IConfigRepository) {}

  async execute(): Promise<Config | null> {
    return this.configRepository.get();
  }
}

export class SaveConfigUseCase {
  constructor(private configRepository: IConfigRepository) {}

  async execute(config: Config): Promise<void> {
    await this.configRepository.save(config);
  }
}

export class CheckRulesUseCase {
  constructor(private ruleRepository: IRuleRepository) {}

  async execute(sms: { sender: string; body: string }): Promise<boolean> {
    const rules = await this.ruleRepository.getAll();
    const activeRules = rules.filter(r => r.isActive);
    return activeRules.some(rule => {
      const text = rule.field === 'sender' ? sms.sender : sms.body;
      if (rule.isRegex) {
        try {
          const regex = new RegExp(rule.pattern);
          return regex.test(text);
        } catch {
          return false;
        }
      } else {
        return text.includes(rule.pattern);
      }
    });
  }
}

export class SendTestMessageUseCase {
  constructor(private configRepository: IConfigRepository) {}

  async execute(): Promise<{ success: boolean; message: string }> {
    const config = await this.configRepository.get();
    if (!config) {
      return { success: false, message: 'Config not set' };
    }
    try {
      const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: 'Test message from SMS Forwarder'
        })
      });
      const data = await response.json();
      if (data.ok) {
        return { success: true, message: 'Test sent successfully' };
      } else {
        return { success: false, message: data.description || 'Unknown error' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export class ForwardSMSUseCase {
  constructor(
    private checkRulesUseCase: CheckRulesUseCase,
    private configRepository: IConfigRepository,
    private saveSMSLogUseCase: SaveSMSLogUseCase
  ) {}

  async execute(sender: string, body: string): Promise<void> {
    const sms: SMS = {
      id: Date.now().toString(),
      sender,
      body,
      timestamp: new Date(),
      status: 'filtered'
    };

    const shouldForward = await this.checkRulesUseCase.execute({ sender, body });
    if (!shouldForward) {
      await this.saveSMSLogUseCase.execute(sms);
      return;
    }

    const config = await this.configRepository.get();
    if (!config) {
      sms.status = 'error';
      sms.errorMessage = 'Config not set';
      await this.saveSMSLogUseCase.execute(sms);
      return;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: `SMS from ${sender}: ${body}`
        })
      });
      const data = await response.json();
      if (data.ok) {
        sms.status = 'forwarded';
      } else {
        sms.status = 'error';
        sms.errorMessage = data.description || 'Telegram error';
      }
    } catch (error) {
      sms.status = 'error';
      sms.errorMessage = error.message;
    }

    await this.saveSMSLogUseCase.execute(sms);
  }
}