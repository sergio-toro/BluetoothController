import { Component, OnInit } from '@angular/core';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit {
  btEnabled: boolean = false;
  btScanning: boolean = false;
  pairedDevices = [];
  unpairedDevices = [];

  constructor(public navCtrl: NavController, private bluetoothSerial: BluetoothSerial) { }

  ngOnInit() {
    this.bluetoothSerial.isEnabled()
      .then(() => this.onBluetoothEnabled())
      .catch(() => this.enableBluetooth())
  }

  enableBluetooth() {
    this.bluetoothSerial.enable()
      .then(() => this.onBluetoothEnabled())
      .catch((error: string) => {
        console.log('ERROR', error);
      })
  }

  onBluetoothEnabled() {
    this.btEnabled = true;
    this.listPairedDevices();
    this.discoverUnpairedDevices();
  }

  listPairedDevices() {
    this.bluetoothSerial.list()
      .then((devices: any): any => {
        this.pairedDevices = devices;
      })
      .catch((error): void => {
        console.log('listPairedDevices ERROR', error)
      })
  }

  discoverUnpairedDevices() {
    this.btScanning = true;
    this.bluetoothSerial.discoverUnpaired()
      .then((devices: any): any => {
        this.btScanning = false;
        this.unpairedDevices = devices;
      })
      .catch((error): void => {
        this.btScanning = false;
        console.log('discoverUnpairedDevices ERROR', error)
      })
  }

}
