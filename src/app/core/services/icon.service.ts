import { Injectable } from '@angular/core';
import { toString } from '@carbon/icon-helpers';
import {
  IconCache,
  IconMemoryCache,
  IconDescriptor,
} from 'carbon-components-angular';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  private iconCache: IconCache = new IconMemoryCache();

  public registerAll(descriptors: object[]) {
    descriptors.forEach((icon) => this.register(icon));
  }

  public register(descriptor: object) {
    const { name } = descriptor as IconDescriptor;
    this.registerAs(name, descriptor);
  }

  public registerAs(name: string, descriptor: object) {
    const { size } = descriptor as IconDescriptor;
    this.iconCache.set(name, size.toString(), descriptor);
  }

  public get(name: string, size: string): IconDescriptor {
    try {
      const icon = this.iconCache.get(name, size.toString()) as IconDescriptor;
      if (!icon.svg) {
        icon.svg = toString(icon);
      }
      return icon;
    } catch (e) {
      throw e;
    }
  }

  public configure(options: { cache: IconCache }) {
    this.iconCache = options.cache;
  }
}
