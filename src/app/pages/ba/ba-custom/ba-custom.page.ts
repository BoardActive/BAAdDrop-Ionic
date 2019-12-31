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
    let customATTR = [];
    this.boardActiveService.getMe().then(data => {
      const user: any = data;
      this.stockAttributes = user.attributes.stock;
      this.customAttributes = user.attributes.custom;
      
      for (const key in this.customAttributes) {
        let value = this.customAttributes[key];        
        if (this.customAttributes.hasOwnProperty(key)) {
          this.myForm.addControl(key, new FormControl(this.customAttributes[key], Validators.required));
        }else{
          console.log(`[test4] else ${value}`);
        }
      }
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
    this.buildAttributes().then(customAttributes => {
      this.boardActiveService.putMe(this.stockAttributes, customAttributes).then(data => {
        this.utilService.navigate('/ba-messages', false);
      });  
    });
  }

  private buildAttributes(): Promise<any> {
    return new Promise((resolve, reject) => {
      var item;
      var custom: {[k: string]: any} = {};
      for (let controller in this.myForm.controls) {
        let control: AbstractControl = <FormControl>this.myForm.controls[controller];
        var key = this.getName(control);
        var value: string = control.value;
        custom[key] = value;
        item = { ...item, custom};
      }
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
