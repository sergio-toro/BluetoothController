import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Observable } from 'rxjs/Observable';
import uniqBy from 'lodash/uniqBy';
import 'rxjs/add/observable/fromPromise';

import { BluetoothDevice } from './bluetooth-device';
import { BluetoothCheck } from './bluetooth-check';

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
  BT_CHECK_TIMEOUT: number = 5000;
  PAIRED_KEY: string = 'PAIRED_DEVICES';
  UNPAIRED_KEY: string = 'UNPAIRED_DEVICES';
  CONNECTED_KEY: string = 'CONNECTED_DEVICE';

  connectedDevice: any;

  bluetoothCheck: BluetoothCheck;

  constructor(
    private storage: Storage,
    private bluetoothSerial: BluetoothSerial,
    private events: Events,
  ) {

    storage.ready()
      .then(() => {
        console.log('STORAGE ready');
      })
      .catch((err) => {
        console.log('STORAGE not ready');
      });

    this.bluetoothCheck = new BluetoothCheck((): Promise<any> => (
      this.bluetoothSerial.isEnabled()
    ));
  }

  isEnabled(): Observable<boolean> {
    return this.bluetoothCheck.getObservable();
  }

  enable(): Observable<void> {
    return Observable.fromPromise(
      this.bluetoothSerial.enable()
        .then(() => {
          this.bluetoothCheck.sendEnabled();
        })
    );
  }

  connectToDevice(device: BluetoothDevice): Promise<any> {
    return new Promise((resolve, reject) => {
      this.disconnectFromDevice().then(() => {
        this.connectedDevice = this.bluetoothSerial.connect(device.id)
          .subscribe(
            (data) => {
              this.storage.set(this.CONNECTED_KEY, device);
              resolve(data);
            },
            (error) => {
              console.log('connectToDevice Error', JSON.stringify(error));
              reject(error);
            }
          );
      });
    });
  }

  disconnectFromDevice(): Promise<void> {
    if (this.connectedDevice) {
      this.connectedDevice.unsubscribe();
      return this.storage.remove(this.CONNECTED_KEY);
    }
    return Promise.resolve();
  }

  listPairedDevices(): Observable<BluetoothDevice[]> {
    return Observable.create((observer) => {
      this.storage.get(this.PAIRED_KEY)
        .then((devices) => {
          if (devices) {
            observer.next(devices);
          }
        })

      this.bluetoothSerial.list()
        .then(uniqDevices)
        .then((devices) => {
          if (devices) {
            this.storage.set(this.PAIRED_KEY, devices);
          }
          observer.next(devices);
          observer.complete();
        })
    });
  }

  discoverUnpairedDevices(): Observable<BluetoothDevice[]> {
    return Observable.create((observer) => {
      this.storage.get(this.UNPAIRED_KEY)
        .then((devices) => {
          if (devices) {
            observer.next(devices);
          }
        })

      this.bluetoothSerial.discoverUnpaired()
        .then(uniqDevices)
        .then((devices) => {
          if (devices) {
            this.storage.set(this.UNPAIRED_KEY, devices);
          }
          observer.next(devices);
          observer.complete();
        })
    });
  }

}
