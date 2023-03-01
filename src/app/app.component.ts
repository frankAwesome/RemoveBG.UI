import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent {

  constructor(private http: HttpClient, private spinner: NgxSpinnerService)
  {
  }

  title = 'RemoveBG';

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
        this.http.post<any>('http://localhost:5000/removebg', base64Image ).subscribe((response: any) => {
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
  

}
