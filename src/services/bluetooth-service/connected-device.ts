import { Injectable } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { BluetoothDevice } from './';

@Injectable()
export class ConnectedDevice {
  CHECK_TIMEOUT: number = 5000;

  subject: ReplaySubject<BluetoothDevice>;
  device: BluetoothDevice;

  constructor(private bluetoothSerial: BluetoothSerial) {
    this.subject = new ReplaySubject();
  }

  startCheck(device: BluetoothDevice): void {
    this.device = device;
    this.check();
  }

  getObservable(): Observable<BluetoothDevice> {
    return this.subject;
  }

  check(): void {
    this.bluetoothSerial.isConnected()
      .then((value) => {
        this.sendConnected();
        setTimeout(this.check.bind(this), this.CHECK_TIMEOUT);
      })
      .catch(() => {
        this.sendNotConnected();
        setTimeout(this.check.bind(this), this.CHECK_TIMEOUT);
      });
  };

  sendConnected(): void {
    this.subject.next(this.device);
  }

  sendNotConnected(): void {
    this.subject.next(null);
  }
}
