import { AppConfig } from '../types';

export class OnboardingService {
  private static readonly CONFIG_KEY = 'aws_restart_config';

  static getConfig(): AppConfig {
    if (typeof window === 'undefined') return { showOnboarding: true };
    
    const configJson = localStorage.getItem(this.CONFIG_KEY);
    if (!configJson) return { showOnboarding: true };
    
    try {
      return JSON.parse(configJson);
    } catch {
      return { showOnboarding: true };
    }
  }

  static setConfig(config: AppConfig): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.CONFIG_KEY, JSON.stringify(config));
  }

  static completeOnboarding(): void {
    this.setConfig({ showOnboarding: false });
  }

  static resetOnboarding(): void {
    this.setConfig({ showOnboarding: true });
  }
}