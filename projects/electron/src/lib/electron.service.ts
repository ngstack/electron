import { Injectable, NgZone } from '@angular/core';
import { IpcRenderer } from 'electron';

declare const window: any;

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  private ipcRenderer: IpcRenderer;

  constructor(private zone: NgZone) {
    if (window.require) {
      try {
        this.ipcRenderer = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    }
  }

  get isDesktopApp(): boolean {
    return !!window.navigator.userAgent.match(/Electron/);
  }

  get isWebApp(): boolean {
    return !this.isDesktopApp;
  }

  on(channel: string, listener: Function): void {
    if (!this.ipcRenderer) {
      return;
    }
    this.ipcRenderer.on(channel, (event: any, ...args: string[]) => {
      this.zone.run(() => {
        if (listener) {
          listener(event, ...args);
        }
      });
    });
  }

  send(channel: string, ...args): void {
    if (!this.ipcRenderer) {
      return;
    }
    this.ipcRenderer.send(channel, ...args);
  }
}
