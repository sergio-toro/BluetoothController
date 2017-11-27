import { Component, OnInit } from '@angular/core';

import { BluetoothService, Device } from '../../services/bluetooth-service';
import { BluetoothPage } from '../bluetooth/bluetooth';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit {

  tab1Root = HomePage;
  tab2Root = BluetoothPage;
  tab3Root = ContactPage;

  isConnected: boolean = false;

  constructor(private bluetoothService: BluetoothService) {

  }

  ngOnInit() {
    this.checkDeviceConnected();
  }

  checkDeviceConnected(): void {
    this.bluetoothService.isConnected()
      .subscribe((device: Device) => {
        this.isConnected = device ? true : false;
      });
  }
}
