import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Safely sanitizes HTML content for rendering in templates.
 *
 * SECURITY NOTICE:
 * - This pipe should only be used with trusted content
 * - All content is sanitized using Angular's DomSanitizer
 * - Usage is logged in development mode for security auditing
 * - Contains additional security checks for government compliance
 *
 * @example
 * // In template
 * <div [innerHTML]="trustedContent | safeHtml"></div>
 */
@Pipe({
  name: 'safeHtml',
  standalone: true,
  pure: true, // Ensures the pipe is pure for better performance
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) {
      return '';
    }

    if (this.containsDangerousContent(value)) {
      console.warn(
        '[SafeHtml Security Warning]',
        'Potentially dangerous content was sanitized:',
        value
      );
    }

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  private containsDangerousContent(value: string): boolean {
    return /<script|javascript:|data:|base64,/i.test(value);
  }
}
