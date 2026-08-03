import { type Page } from '@playwright/test';
import { HeaderComponent } from './HeaderComponent';

/**
 * Shared plumbing for every TechStore page object: the Playwright `Page` and
 * the header that all views have in common.
 */
export abstract class BasePage {
  readonly header: HeaderComponent;

  protected constructor(protected readonly page: Page) {
    this.header = new HeaderComponent(page);
  }
}
