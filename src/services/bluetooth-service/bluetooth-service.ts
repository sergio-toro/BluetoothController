import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Observable } from 'rxjs/Observable';
import uniqBy from 'lodash/uniqBy';
import 'rxjs/add/observable/fromPromise';

import { Device, BluetoothCheck, DeviceCheck } from './';

const uniqDevices = (devices: Device[]): Device[] => (
  uniqBy(devices, 'id')
);


@Injectable()
export class BluetoothService {
  PAIRED_KEY: string = 'PAIRED_DEVICES';
  UNPAIRED_KEY: string = 'UNPAIRED_DEVICES';
  CONNECTED_KEY: string = 'CONNECTED_DEVICE';

  bluetoothCheck: BluetoothCheck;
  deviceCheck: DeviceCheck;

  constructor(
    private storage: Storage,
    private bluetoothSerial: BluetoothSerial,
    private toastCtrl: ToastController,
  ) {
    this.bluetoothCheck = new BluetoothCheck(bluetoothSerial);
    this.deviceCheck = new DeviceCheck(bluetoothSerial);

    this.isEnabled().subscribe((enabled) => {
      if (!enabled) {
        return;
      }

      this.storage.get(this.CONNECTED_KEY).then((device: Device) => {
        if (device) {
          this.connectToDevice(device);
        }
      });
    });
  }

  isEnabled(): Observable<boolean> {
    return this.bluetoothCheck.getObservable();
  }

  isConnected(): Observable<Device> {
    return this.deviceCheck.getObservable();
  }

  enable(): Promise<void> {
    return this.bluetoothCheck.enable();
  }

  connectToDevice(device: Device, connectTry: number = 1): Promise<any> {
    return this.deviceCheck.connect(device)
      .then(() => {
        this.storage.set(this.CONNECTED_KEY, device);
      })
      .catch((error) => {
        let toast = this.toastCtrl.create({
          message: `Failed to connect to ${device.name}. Try ${connectTry}/3`,
          duration: 3000,
          showCloseButton: true,
        });
        toast.present();

        console.log('connectToDevice Error', connectTry, JSON.stringify(error));
        if (connectTry === 3) {
          throw error;
        } else {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(this.connectToDevice(device, connectTry + 1));
            }, 1000);
          });
        }
      });
  }

  disconnectFromDevice(): Promise<void> {
    return this.storage
      .remove(this.CONNECTED_KEY)
      .then(() => this.bluetoothSerial.disconnect())
      .then(() => {
        this.deviceCheck.sendNotConnected();
      });
  }

  listPairedDevices(): Observable<Device[]> {
    return Observable.create((observer) => {
      this.storage.get(this.PAIRED_KEY)
        .then((devices) => {
          if (devices) {
            observer.next(devices);
          }
        });

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

  discoverUnpairedDevices(): Observable<Device[]> {
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
