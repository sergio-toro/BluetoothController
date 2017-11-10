import { Component } from '@angular/core';

import { BluetoothPage } from '../bluetooth/bluetooth';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = BluetoothPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
