import { Component, OnInit } from '@angular/core';
import { BluetoothService, BluetoothDevice } from '../../services/bluetooth-service';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html'
})
export class BluetoothPage implements OnInit {
  btScanning: boolean = false;
  connectedDevice: BluetoothDevice;
  pairedDevices = [];
  unpairedDevices = [];

  constructor(public navCtrl: NavController, private bluetoothService: BluetoothService) { }

  ngOnInit() {
    this.bluetoothService.isEnabled()
      .subscribe((enabled) => {
        if (enabled) {
          this.listPairedDevices();
          this.discoverUnpairedDevices();
        }
      });
  }

  connectToDevice(device: BluetoothDevice) {
    this.bluetoothService.connectToDevice(device)
      .then((data) => {
        console.log('CONNECTED', data);
        this.connectedDevice = device;
      })
      .catch((error) => {
        console.log('ERROR', error)
      });
  }

  listPairedDevices() {
    this.bluetoothService.listPairedDevices()
      .subscribe(
        (devices: BluetoothDevice[]) => {
          this.pairedDevices = devices;
        },
        (error) => {
          console.log('listPairedDevices ERROR', error)
        },
      );
  }

  discoverUnpairedDevices() {
    this.btScanning = true;
    this.bluetoothService.discoverUnpairedDevices()
      .subscribe(
        (devices: BluetoothDevice[]) => {
          this.unpairedDevices = devices;
        },
        (error) => {
          console.log('discoverUnpairedDevices ERROR', error)
        },
        () => { this.btScanning = false; }
      );
  }

}
