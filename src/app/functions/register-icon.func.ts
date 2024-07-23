import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

export function registerIcon(
  data: string[],
  sanitizer: DomSanitizer,
  iconRegistry: MatIconRegistry,
) {
  for (let index = 0; index < data.length; index++) {
    const element = data[index];

    iconRegistry.addSvgIcon(
      element,
      sanitizer.bypassSecurityTrustResourceUrl(`icons/${element}.svg`),
    );
  }
}
