import { Component, OnInit } from '@angular/core';
import { BluetoothService, Device } from '../../services/bluetooth-service';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html'
})
export class BluetoothPage implements OnInit {
  btScanning: boolean = false;
  connectedDevice: Device;
  pairedDevices = [];
  unpairedDevices = [];

  constructor(public navCtrl: NavController, private bluetoothService: BluetoothService) { }

  ngOnInit() {
    this.checkDeviceConnected();
    this.listPairedDevices();
    this.discoverUnpairedDevices();
  }

  checkDeviceConnected(): void {
    this.bluetoothService.isConnected()
      .subscribe((device: Device) => {
        if (device) {
          this.connectedDevice = device;
        } else {
          this.connectedDevice = null;
        }
      });
  }

  connectToDevice(device: Device) {
    this.bluetoothService.connectToDevice(device);
  }

  disconnectFromDevice() {
    this.bluetoothService.disconnectFromDevice();
  }

  listPairedDevices() {
    this.bluetoothService.listPairedDevices()
      .subscribe(
        (devices: Device[]) => {
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
        (devices: Device[]) => {
          this.unpairedDevices = devices;
        },
        (error) => {
          console.log('discoverUnpairedDevices ERROR', error)
        },
        () => { this.btScanning = false; }
      );
  }

}
