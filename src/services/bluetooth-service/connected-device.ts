import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class ConnectedDevice {
  BT_CHECK_TIMEOUT: number = 5000;

  subject: Subject<boolean>;
  deviceConnect;

  constructor(deviceConnect, device) {
    this.deviceConnect = deviceConnect;

    this.subject = new Subject();

    if (device) {
      this.connect(device);
    }
  }

  getObservable(): Observable<boolean> {
    return this.subject;
  }

  connect(): void {
    this.deviceConnect()
      .then((value) => {
        this.sendConnected();
      })
      .catch((err) => {
        this.sendNotConnected(err);
      });
  };

  sendConnected(): void {
    this.subject.next(true);
  }

  sendNotConnected(err): void {
    this.subject.next(err);
  }
}
