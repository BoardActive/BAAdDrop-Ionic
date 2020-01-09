import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UtilService } from '../../../services/util/util.service';
import { BoardActiveService } from '../../../services/boardactive/board-active.service';
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
  stockAttributes: any;
  customAttributes: any = [];
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

    this.boardActiveService.getAttributes().then(data => {
      console.log(JSON.stringify(data, null, 2));
      const attributes: any = data;

      for (const key in attributes) {
        if(!attributes[key].isStock) {
          console.log(`isStock: ${JSON.stringify(attributes[key], null, 2)}`);
          this.myForm.addControl(attributes[key].name, new FormControl());
        }
      }

      this.boardActiveService.getMe().then(data => {
        console.log(JSON.stringify(data, null, 2));
        const user: any = data;
        this.stockAttributes = user.attributes.stock;
        this.customAttributes = user.attributes.custom;
  
        for (const attribute in this.customAttributes) {
          let value = this.customAttributes[attribute];        
            for (let controller in this.myForm.controls) {
              let control: AbstractControl = <FormControl>this.myForm.controls[controller];
              const name = this.getName(control);
              if(name === attribute) {
                control.setValue(value);
              }
            }
          }
      });  
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
