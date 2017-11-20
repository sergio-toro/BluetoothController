import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class BluetoothCheck {
  BT_CHECK_TIMEOUT: number = 5000;

  subject: Subject<boolean>;
  bluetoothCheck;

  constructor(bluetoothCheck) {
    this.bluetoothCheck = bluetoothCheck;

    this.subject = new Subject();
    this.check();
  }

  getObservable(): Observable<boolean> {
    return this.subject;
  }

  check(): void {
    this.bluetoothCheck()
      .then((value) => {
        this.sendEnabled();
        setTimeout(this.check.bind(this), this.BT_CHECK_TIMEOUT);
      })
      .catch((err) => {
        this.sendDisabled();
        setTimeout(this.check.bind(this), this.BT_CHECK_TIMEOUT);
      });
  };

  sendEnabled(): void {
    this.subject.next(true);
  }

  sendDisabled(): void {
    this.subject.next(false);
  }
}