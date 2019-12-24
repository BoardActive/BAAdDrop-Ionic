import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UtilService } from '../../../services/util/util.service';
import { BoardActiveService, customAttributes } from '../../../services/boardactive/board-active.service';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';

interface custom extends Array<string> {
  name: string;
  value: string;
}

@Component({
  selector: 'app-ba-custom',
  templateUrl: './ba-custom.page.html',
  styleUrls: ['./ba-custom.page.scss'],
})
export class BaCustomPage implements OnInit {
  public myForm: FormGroup;
  private playerCount: number = 1;
  stockAttributes: any;
  customAttributes: any;
  customAtrib: custom[];

  public custom: {
    name: any,
    value: any
  }

  constructor(
    private alertController: AlertController,
    private formBuilder: FormBuilder,
    private utilService: UtilService,
    private boardActiveService: BoardActiveService
  ) {

    this.myForm = this.formBuilder.group({

    });

    this.boardActiveService.putMe().then(data => {
      console.log(`user: ${JSON.stringify(data, null, 2)}`);
      const user: any = data;
      this.stockAttributes = user.attributes.stock;
      this.customAttributes = user.attributes.custom;
      Object.keys(this.customAttributes).forEach(key => {
        console.log(key + ": " + this.customAttributes[key]);
        this.myForm.addControl(this.customAttributes[key].name, new FormControl(this.customAttributes[key].value, Validators.required));
      });
      console.log(`user.attributes.stock: ${JSON.stringify(user, null, 2)}`);
    });

  }

  ngOnInit() {

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
            if(data.name) {
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
    let myarray: customAttributes[];
    this.buildAttributes().then(customAttributes => {
      this.boardActiveService.putMe(this.stockAttributes, customAttributes).then(data => {
        this.utilService.navigate('/ba-messages', false);
      });  
    });
  }

  private buildAttributes(): Promise<any> {
    return new Promise((resolve, reject) => {
      var item = `{`;
      for (let key in this.myForm.controls) {
        let control: AbstractControl = <FormControl>this.myForm.controls[key];
        let name: string = `${this.getName(control)}`;
        let value: string = `${control.value}`;
        item += `\"${name}\": \"${value}\",`;
      }
      item += `}`;
      resolve(item);
    });
  }

  private toArray(obj) {
    let array = [];
    Object.keys(obj).forEach(key => {
      array.push(obj[key]);
    })
    return array;
  }

  private getName(control: AbstractControl): string | null {
    let group = <FormGroup>control.parent;

    if (!group) {
      return null;
    }

    let name: string;

    Object.keys(group.controls).forEach(key => {
      let childControl = group.get(key);
      if (childControl !== control) {
        return;
      }
      name = key;
    });
    return name;
  }

  cancel() {
    this.utilService.navigate('/ba-messages', false);
  }

}
