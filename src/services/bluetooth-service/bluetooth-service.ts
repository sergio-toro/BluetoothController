import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Observable } from 'rxjs/Observable';
import uniqBy from 'lodash/uniqBy';
import 'rxjs/add/observable/fromPromise';

import { BluetoothDevice, BluetoothCheck, DeviceCheck } from './';

const uniqDevices = (devices: BluetoothDevice[]): BluetoothDevice[] => (
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

    this.storage.get(this.CONNECTED_KEY)
      .then((device: Device) => {
        console.log('Storage (Device):', JSON.stringify(device));
        if (device) {
          this.connectToDevice(device);
        }
      });

    this.bluetoothCheck = new BluetoothCheck(bluetoothSerial);
    this.deviceCheck = new DeviceCheck(bluetoothSerial);
  }

  isEnabled(): Observable<boolean> {
    return this.bluetoothCheck.getObservable();
  }

  isConnected(): Observable<Device> {
    return this.deviceCheck.getObservable();
  }

  enable(): Observable<void> {
    return Observable.fromPromise(
      this.bluetoothSerial.enable()
        .then(() => {
          this.bluetoothCheck.sendEnabled();
        })
    );
  }

  connectToDevice(device: BluetoothDevice, connectTry: number = 1): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.set(this.CONNECTED_KEY, device).then(() => {
        this.bluetoothSerial.connect(device.id).subscribe(
          (data) => {
            this.deviceCheck.start(device);
            resolve(data);
          },
          (error) => {
            let toast = this.toastCtrl.create({
              message: `Failed to connect to ${device.name}. Try ${connectTry}/3`,
              duration: 3000,
              showCloseButton: true,
            });
            toast.present();

            console.log('connectToDevice Error', connectTry, JSON.stringify(error));
            if (connectTry === 3) {
              reject(error);
            } else {
              this.connectToDevice(device, connectTry + 1);
            }

          }
        );
      });
    });
  }

  disconnectFromDevice(): Promise<void> {
    return this.storage
      .remove(this.CONNECTED_KEY)
      .then(() => this.bluetoothSerial.disconnect())
      .then(() => {
        this.deviceCheck.sendNotConnected();
        return true;
      });
  }

  listPairedDevices(): Observable<BluetoothDevice[]> {
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
