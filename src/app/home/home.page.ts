import { Component } from '@angular/core';

import * as Tesseract from 'tesseract.js';
import {createWorker} from 'tesseract.js'

import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';
const {Camera} = Plugins ;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  worker: Tesseract.Worker ;
  workerReady =  false ;
  image = 'assets/ocr.png';
  ocrResult = '' ;
  captureProgress = 0 ;
  constructor() {
    this.loadWorker();
  }


 async loadWorker(){
    this.worker = createWorker({
      logger: progress => {
        console.log(progress);
        if(progress.status === 'recognizing text'){
          this.captureProgress = parseInt('' + progress.progress * 100 );
        }
      }
    });

    await this.worker.load();
    await this.worker.loadLanguage('eng');
    await this.worker.initialize('eng');
    console.log('FIN');
    this.workerReady = true ; 
    
  }
  async captureImage(){
    const image = await Camera.getPhoto({
      quality: 90,
      // allowEditing: true,
      
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });
    console.log('image :' + JSON.stringify(image));
    this.image = image.dataUrl ;
    
    
  }


  async recognieImage(){
    const result = await this.worker.recognize(this.image);
    console.log('result : '+result);
    this.ocrResult = result.data.text ; 
    
  }

  async recogniceImage(){
    // this.selectedImage='../../assets/1.png'
    Tesseract.recognize(this.image)
    .then(({ data: { text } })=>{
    alert(text)
    this.ocrResult = text;
    })
    .catch(err=>console.error(err))
    
    }
}
