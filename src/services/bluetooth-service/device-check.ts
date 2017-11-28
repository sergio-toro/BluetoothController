import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Device } from './';

export class DeviceCheck {
  CHECK_TIMEOUT: number = 5000;

  timeout: any;
  bluetoothSerial: BluetoothSerial;
  subject: BehaviorSubject<Device>;
  device: Device;

  isConnected: boolean = null;

  constructor(bluetoothSerial: BluetoothSerial) {
    this.bluetoothSerial = bluetoothSerial;
    this.subject = new BehaviorSubject(null);
  }

  connect(device: Device): Promise<any> {
    return new Promise((resolve, reject) => {
      this.bluetoothSerial.connect(device.id).subscribe(
        () => {
          this.device = device;
          this.check();
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getObservable(): Observable<Device> {
    return this.subject;
  }

  check(): void {
    clearTimeout(this.timeout);
    this.bluetoothSerial.isConnected()
      .then((value) => {
        if (!this.isConnected) {
          this.isConnected = true;
          this.sendConnected();
        }
        this.timeout = setTimeout(this.check.bind(this), this.CHECK_TIMEOUT);
      })
      .catch(() => {
        if (this.isConnected === true) {
          this.isConnected = false;
          this.sendNotConnected();
        }
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
