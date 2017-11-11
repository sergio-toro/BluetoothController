import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Observable } from 'rxjs/Observable';
import uniqBy from 'lodash/uniqBy';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/merge';

import { BluetoothDevice } from './bluetooth-device';

const uniqDevices = (devices: BluetoothDevice[]): BluetoothDevice[] => (
  uniqBy(devices, 'id')
);
/*
  Generated class for the BluetoothServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BluetoothService {
  PAIRED_STORAGE_KEY: string = 'PAIRED_DEVICES';
  UNPAIRED_STORAGE_KEY: string = 'UNPAIRED_DEVICES';

  constructor(private storage: Storage, private bluetoothSerial: BluetoothSerial) {

    storage.ready()
      .then(() => {
        console.log('STORAGE ready');
      })
      .catch((err) => {
        console.log('STORAGE not ready');
      });
  }

  isEnabled(): Observable<void> {
    return Observable.fromPromise(
      this.bluetoothSerial.isEnabled()
    );
  }

  enable(): Observable<void> {
    return Observable.fromPromise(
      this.bluetoothSerial.enable()
    );
  }

  listPairedDevices(): Observable<BluetoothDevice[]> {
    return Observable.create((observer) => {
      this.storage.get(this.PAIRED_STORAGE_KEY)
        .then((devices) => {
          if (devices) {
            observer.next(devices);
          }
        })

      this.bluetoothSerial.list()
        .then(uniqDevices)
        .then((devices) => {
          if (devices) {
            this.storage.set(this.PAIRED_STORAGE_KEY, devices);
          }
          observer.next(devices);
          observer.complete();
        })
    });
  }

  discoverUnpairedDevices(): Observable<BluetoothDevice[]> {
    return Observable.create((observer) => {
      this.storage.get(this.UNPAIRED_STORAGE_KEY)
        .then((devices) => {
          if (devices) {
            observer.next(devices);
          }
        })

      this.bluetoothSerial.discoverUnpaired()
        .then(uniqDevices)
        .then((devices) => {
          if (devices) {
            this.storage.set(this.UNPAIRED_STORAGE_KEY, devices);
          }
          observer.next(devices);
          observer.complete();
        })
    });
  }

}
