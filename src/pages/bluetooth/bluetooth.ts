import { Component, OnInit } from '@angular/core';
import { BluetoothService, BluetoothDevice } from '../../services/bluetooth-service';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html'
})
export class BluetoothPage implements OnInit {
  btEnabled: boolean = false;
  btScanning: boolean = false;
  pairedDevices = [];
  unpairedDevices = [];

  constructor(public navCtrl: NavController, private bluetoothService: BluetoothService) { }

  ngOnInit() {
    this.bluetoothService.isEnabled()
      .subscribe(
        () => this.onBluetoothEnabled(),
        () => this.enableBluetooth()
      );
  }

  enableBluetooth() {
    this.bluetoothService.enable()
      .subscribe(
        () => this.onBluetoothEnabled(),
        (error: string) => {
          console.log('ERROR', error);
        }
      );
  }

  onBluetoothEnabled() {
    this.btEnabled = true;
    this.listPairedDevices();
    this.discoverUnpairedDevices();
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
