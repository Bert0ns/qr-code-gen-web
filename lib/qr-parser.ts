import {
  PayloadStrategy,
  WiFiStrategy,
  VCardStrategy,
  EmailStrategy,
  URLStrategy,
  FallbackStrategy,
} from './payload-strategies';

export class QRParser {
  private strategies: PayloadStrategy[] = [];

  constructor() {
    this.strategies.push(new URLStrategy());
    this.strategies.push(new WiFiStrategy());
    this.strategies.push(new EmailStrategy());
    this.strategies.push(new VCardStrategy());
    // Fallback must always be last
    this.strategies.push(new FallbackStrategy());
  }

  public parse(jsonString: string): { name: string; payload: string; error?: string } {
    if (!jsonString || !jsonString.trim()) {
      return { name: 'Empty', payload: '' };
    }

    try {
      const data = JSON.parse(jsonString);

      for (const strategy of this.strategies) {
        if (strategy.detect(data)) {
          return {
            name: strategy.name,
            payload: strategy.generate(data),
          };
        }
      }

      return { name: 'JSON', payload: JSON.stringify(data) };
    } catch {
      return { name: 'Error', payload: '', error: 'Invalid JSON format' };
    }
  }
}
