import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { Device } from './';

export class DeviceCheck {
  CHECK_TIMEOUT: number = 5000;

  timeout: any;
  bluetoothSerial: BluetoothSerial;
  subject: ReplaySubject<Device>;
  device: Device;

  constructor(bluetoothSerial: BluetoothSerial) {
    this.bluetoothSerial = bluetoothSerial;
    this.subject = new ReplaySubject(1);
  }

  start(device: Device): void {
    this.device = device;
    this.check();
  }

  getObservable(): Observable<Device> {
    return this.subject;
  }

  check(): void {
    clearTimeout(this.timeout);
    this.bluetoothSerial.isConnected()
      .then((value) => {
        this.sendConnected();
        this.timeout = setTimeout(this.check.bind(this), this.CHECK_TIMEOUT);
      })
      .catch(() => {
        this.sendNotConnected();
        this.timeout = setTimeout(this.check.bind(this), this.CHECK_TIMEOUT);
      });
  };

  sendConnected(): void {
    this.subject.next(this.device);
  }

  sendNotConnected(): void {
    this.subject.next(null);
  }
}
