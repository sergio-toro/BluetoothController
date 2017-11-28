import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import nipplejs from 'nipplejs';
// var manager = require('nipplejs').create(options);

@Component({
  selector: 'page-joystick',
  templateUrl: 'joystick.html'
})
export class JoystickPage implements OnInit {

  constructor(public navCtrl: NavController) {

  }

  ngOnInit() {
    const manager = nipplejs.create({
      zone: document.getElementById('dynamic'),
      color: 'blue',
    });

    manager.on('move', function (evt, data) {
      console.log('MOVEEEE', JSON.stringify(data));
    });
  }

}
