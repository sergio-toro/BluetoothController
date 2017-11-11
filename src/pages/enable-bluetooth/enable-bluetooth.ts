import { Component } from '@angular/core';
import { BluetoothService } from '../../services/bluetooth-service';

@Component({
  templateUrl: 'enable-bluetooth.html'
})
export class EnableBluetoothPage {
  constructor(private bluetoothService: BluetoothService) { }

  enableBluetooth() {
    this.bluetoothService.enable()
      .subscribe(
        () => {
          console.log('enableBluetooth Bluetooth enabled');
        },
        (error: string) => {
          console.log('enableBluetooth ERROR', error);
        }
      );
  }


}
