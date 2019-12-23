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
      // alert(`${JSON.stringify(user, null, 2)}`);
      this.stockAttributes = user.attributes.stock;
      this.customAttributes = user.attributes.custom;
      // alert(`${JSON.stringify(user.attributes.stock, null, 2)}`);
      // alert(`${JSON.stringify(user.attributes.custom, null, 2)}`);

      Object.keys(this.customAttributes).forEach(key => {
        console.log(key + ": " + this.customAttributes[key]);
        this.myForm.addControl(this.customAttributes[key].name, new FormControl(this.customAttributes[key].value, Validators.required));
      });

      // alert(`${JSON.stringify(this.customAttributes, null, 2)}`);
      // alert(`object length: ${Object.keys(this.customAttributes).length}`);
      // for (var _i = 0; _i < Object.keys(this.customAttributes).length; _i++) {
      //   alert(`${this.customAttributes[_i].name + ' ' + this.customAttributes[_i].value}`);
      //   this.myForm.addControl(this.customAttributes[_i].name, new FormControl(this.customAttributes[_i].value, Validators.required));
      // }
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
          placeholder: 'Name'
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
            this.myForm.addControl(data.name, new FormControl(data.value, Validators.required));
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  removeControl(control) {
    this.myForm.removeControl(control.key);
  }

  save() {
    let myarray: customAttributes[];
    this.buildAttributes().then(res => {
      let customAttributesMap: Map<string, customAttributes[]> = new Map<string, customAttributes[]>();
      customAttributesMap.set('', this.customAttributes);
      alert(JSON.stringify(Object.assign(this.customAttributes), null, 2));
      // alert(`${JSON.stringify(this.customAttributes, null, 2)}`);
      // alert(`${JSON.parse(this.customAttributes)}`);
      // this.boardActiveService.putMe(this.stockAttributes, this.customAttributes).then(data => {
      //   // alert(`user: ${JSON.stringify(data, null, 2)}`);
      //   this.utilService.navigate('/ba-messages', false);
      // });  
    });
  }

  private buildAttributes(): Promise<any> {
    this.customAttributes = [];

    return new Promise((resolve, reject) => {
      for (let key in this.myForm.controls) {
        let control: AbstractControl = <FormControl>this.myForm.controls[key];
        let attribute: customAttributes = {};
        attribute.name = this.getName(control);
        attribute.value = control.value;
        let name: string = `${this.getName(control)}`;
        let value: string = `${control.value}`;
        let item = name + ": " + value;
        // let item: string = "\n" + this.getName(control)  + "\n: \n" +  control.value; + "\n";
        // let item: string = attribute.name  + ": " +  attribute.value;
        this.customAttributes.push(item);
        // this.customAttributes.push(attribute);
      }
      resolve(true);
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
