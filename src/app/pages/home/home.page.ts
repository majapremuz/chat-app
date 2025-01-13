import { Component } from '@angular/core';
import { ContentApiInterface, ContentObject } from 'src/app/model/content';
import { ControllerService } from 'src/app/services/controller.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  translate: any = [];

  contents: Array<ContentObject> = [];

  constructor(
    private dataCtrl: ControllerService,
    private router: Router
  ) {
    this.initTranslate();
  }


  ionViewWillEnter(){
    this.dataCtrl.setHomePage(true);
    // do something when in moment home page opens
  }

  ionViewWillLeave(){
    this.dataCtrl.setHomePage(false);
  }

  async initTranslate(){
    this.translate['test_string'] = await this.dataCtrl.translateWord("TEST.STRING");
  }

  openMessenger() {
    this.router.navigateByUrl('/messenger');
  }

}
