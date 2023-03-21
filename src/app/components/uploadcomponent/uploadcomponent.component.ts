import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgxSpinnerService } from 'ngx-spinner';




import { MoveDirection, ClickMode, HoverMode, OutMode, Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";

@Component({
  selector: 'app-uploadcomponent',
  templateUrl: './uploadcomponent.component.html',
  styleUrls: ['./uploadcomponent.component.sass']
})
export class UploadcomponentComponent{

  constructor(private http: HttpClient, private spinner: NgxSpinnerService)
  {
  }

  ngOnInit() {


    // this.particlesUrl = this.particlesArray[Math.floor(Math.random() * this.particlesArray.length)];;
  }



  imageSrc = '';
  imageList: string[] = [];
  hideDropBox: boolean = true;
  isLoading: boolean = false;


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
    const files = event.target.files;
    this.handleFiles(files);
  }

  handleFiles(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.spinner.show();
        // this.imageList.push(e.target.result);

        const base64Image = e.target.result.toString().split(',')[1];
        this.http.post<any>(`http://localhost:5000/removebg`, base64Image ).subscribe((response: any) => {
          console.log(response);
          this.imageList.push('data:image/jpeg;base64,' + response.image);

          this.spinner.hide();
        });
      };
      reader.readAsDataURL(file);
      
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

}
