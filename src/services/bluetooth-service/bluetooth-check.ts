import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

export class BluetoothCheck {
  BT_CHECK_TIMEOUT: number = 5000;

  timeout: any;
  subject: ReplaySubject<boolean>;
  bluetoothSerial: BluetoothSerial;

  constructor(bluetoothSerial: BluetoothSerial) {
    this.bluetoothSerial = bluetoothSerial;
    this.subject = new ReplaySubject(1);
  }

  getObservable(): Observable<boolean> {
    this.check();
    return this.subject;
  }

  check(): void {
    clearTimeout(this.timeout);

    this.bluetoothSerial.isEnabled()
      .then((value) => {
        this.sendEnabled();
        this.timeout = setTimeout(this.check.bind(this), this.BT_CHECK_TIMEOUT);
      })
      .catch((err) => {
        this.sendDisabled();
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
