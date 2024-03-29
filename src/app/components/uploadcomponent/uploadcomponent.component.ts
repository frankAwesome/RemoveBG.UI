import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgxSpinnerService } from 'ngx-spinner';

import { MoveDirection, ClickMode, HoverMode, OutMode, Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";

import { AngularFireDatabase, AngularFireDatabaseModule, AngularFireList } from '@angular/fire/compat/database';
import { ForegroundService } from 'src/app/services/foreground.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-uploadcomponent',
  templateUrl: './uploadcomponent.component.html',
  styleUrls: ['./uploadcomponent.component.sass']
})
export class UploadcomponentComponent{
  @ViewChild('fileInput') fileInput: any;
    
  constructor(private http: HttpClient, private spinner: NgxSpinnerService, private db: AngularFireDatabase, private myService: ForegroundService, private router: Router)
  {
  }


  imageSrc = '';
  IP = '';
  Country = '';
  imageList: string[] = [];
  hideDropBox: boolean = true;
  isLoading: boolean = false;

  uploadHeight = 0;
  uploadWidth= 0;


  onDrop(event: any) {
    this.isLoading = true;
    
    event.preventDefault();
    const files = event.dataTransfer.files;
    this.hideDropBox = false;
    this.handleFiles(files);
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onFileSelected(event: any) {
    this.isLoading = true;
    const files = event.target.files;
    this.handleFiles(files);
  }

  handleFiles(files: FileList) {
    for (let i = 0; i < 1; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.spinner.show();
        // this.imageList.push(e.target.result);

        const base64Image = e.target.result.toString().split(',')[1];
        this.http.post<any>("http://3.82.126.18:5000/removebg", base64Image ).subscribe((response: any) => {
          //this.myService.myString = 'data:image/jpeg;base64,' + response.image;
          this.myService.changeMessage('data:image/jpeg;base64,' + response.image);
          //console.log(this.myService.myString);
          (window as any).myGlobalForeground = 'data:image/jpeg;base64,' + response.image;
          this.imageList.push('data:image/jpeg;base64,' + response.image);

          

          this.spinner.hide();
          this.myService.changeMessage('data:image/jpeg;base64,' + response.image);
          this.router.navigate(['/imageedit']);


          try
          {
            this.http.get('https://geolocation-db.com/json', {
              headers: {'Access-Control-Allow-Origin':'*'}
           }).subscribe((response:any) => {
              this.IP = response.IPv4;
              this.Country = response.country_name;
              console.log(response);
            });
      
            const bytes = e.target.result.toString().split(',')[1].length * 0.75;
            const megabytes = bytes / (1024 * 1024);

            const currentDate = new Date();
            const dateTimeString = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;
    
            this.db.list('userlogs').push(
              {
                "IP":this.IP,
                "Country": this.Country,
                "ImageSize":megabytes,
                "TmStamp":dateTimeString
              })
            .then(() => console.log('Object written to database'))
            .catch((error: any) => console.error('Error writing object to database', error));
          }
          catch(ex)
          {}
        });
      };
      reader.readAsDataURL(file)
      
    }
  }

  downloadImage(image: string) {
    const link = document.createElement('a');
    link.setAttribute('href', image);
    link.setAttribute('download', 'image.png');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  particlesLoaded(container: Container): void {
    console.log(container);
  }

  async particlesInit(engine: Engine): Promise<void> {
      console.log(engine);

      // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadFull(engine);
  }


  onClick() {
    this.fileInput.nativeElement.click();
  
    
  }

}
