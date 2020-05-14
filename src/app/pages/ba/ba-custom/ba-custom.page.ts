import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UtilService } from '../../../services/util/util.service';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';

export class custom {
  key: string;
  label: string;
  type: string;
  value: string;
  required: boolean
  data: any;
  order: number;
}

@Component({
  selector: 'app-ba-custom',
  templateUrl: './ba-custom.page.html',
  styleUrls: ['./ba-custom.page.scss'],
})
export class BaCustomPage implements OnInit {

  public myForm: FormGroup;
  stockAttributes: any;
  customAttributes: any = [];
  dynamicForm: any = [];
  customAtrib: custom[] = [];

  // public custom: {
  //   name: any,
  //   value: any
  // }

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private boardActiveService: BoardActiveService
  ) {


    this.myForm = this.formBuilder.group({

    });


  }

  ngOnInit() {
    this.boardActiveService.getAttributes().then(data => {
      console.log(`getAttributes(): ${JSON.stringify(data, null, 2)}`);
      const attributes: any = data;
      let order = 0;
      for (const item in attributes) {
        if (!attributes[item].isStock) {
          let thisCustom: custom = new custom;
          thisCustom.key = attributes[item].name;
          thisCustom.label = attributes[item].name;
          thisCustom.type = attributes[item].type;
          thisCustom.value = null;
          thisCustom.required = false;
          for (const thisAttribute in this.customAttributes) {
            if (thisAttribute === thisCustom.key) {
              this.customAtrib[item].data = this.customAttributes[thisAttribute];
            }
          }
          thisCustom.data = null;
          thisCustom.order = order++;
          this.customAtrib.push(thisCustom);
        }
      }

      this.boardActiveService.getMe().then(data => {
        const user: any = data;
        this.stockAttributes = user.attributes.stock;
        this.customAttributes = user.attributes.custom;
  
        for (const thisAttribute in this.customAttributes) {
          for (const item in this.customAtrib) {
            if (thisAttribute === this.customAtrib[item].key) {
              this.customAtrib[item].data = this.customAttributes[thisAttribute];
            }
          }
        }
      });
  
    });
    

  }

  async addCustomAttribute() {
    const alert = await this.alertController.create({
      header: 'Add Custom Attribute',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name *Required'
        },
        {
          name: 'value',
          type: 'text',
          placeholder: 'Value'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            if (data.name) {
              this.myForm.addControl(data.name, new FormControl(data.value, Validators.required));
            };
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  save() {
    this.buildAttributes().then(customAttributes => {
      console.log(`customAttributes save(): ${customAttributes}`);
      this.boardActiveService.putMe(this.stockAttributes, customAttributes).then(data => {
        this.utilService.navigate('/ba-messages', false);
      });
    });
  }

  private buildAttributes(): Promise<any> {
    return new Promise((resolve, reject) => {
      var item;
      var custom: { [k: string]: any } = {};
      for (const i in this.customAtrib) {
        var key = this.customAtrib[i].key;
        var value = this.customAtrib[i].data;
        custom[key] = value;
        item = { ...item, custom };
      }
      resolve(item);
    });
  }

  cancel() {
    this.utilService.navigate('/ba-messages', false);
  }

}
