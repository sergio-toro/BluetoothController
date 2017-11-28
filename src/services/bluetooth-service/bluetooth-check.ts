import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

export class BluetoothCheck {
  BT_CHECK_TIMEOUT: number = 5000;

  timeout: any;
  subject: BehaviorSubject<boolean>;
  bluetoothSerial: BluetoothSerial;

  isEnabled: boolean = null;

  constructor(bluetoothSerial: BluetoothSerial) {
    this.bluetoothSerial = bluetoothSerial;
    this.subject = new BehaviorSubject(null);

    this.check();
  }

  getObservable(): Observable<boolean> {
    return this.subject;
  }

  enable(): Promise<void> {
    return this.bluetoothSerial.enable()
      .then(() => {
        this.check();
      })
      .catch(() => {
        console.log('Failed to enable Bluetooth');
      });
  }

  check(): void {
    clearTimeout(this.timeout);

    this.bluetoothSerial.isEnabled()
      .then((value) => {
        if (!this.isEnabled) {
          this.isEnabled = true;
          this.sendEnabled();
        }
        this.timeout = setTimeout(this.check.bind(this), this.BT_CHECK_TIMEOUT);
      })
      .catch((err) => {
        if (this.isEnabled === true) {
          this.isEnabled = false;
          this.sendDisabled();
        }
        this.timeout = setTimeout(this.check.bind(this), this.BT_CHECK_TIMEOUT);
      });
  };

  sendEnabled(): void {
    this.subject.next(true);
  }

  sendDisabled(): void {
    this.subject.next(false);
  }
}
