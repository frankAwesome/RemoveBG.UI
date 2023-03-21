import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-editimage',
  templateUrl: './editimage.component.html',
  styleUrls: ['./editimage.component.sass']
})
export class EditimageComponent implements OnInit {

  fileToUpload: File | null = null;
  imgX = 0;
  imgY = 0;
  imgWidth = 0;
  imgHeight = 0;
  BGimage = '';
  FGimage = '';
  canvas: HTMLCanvasElement;
  private img = new Image;

  private scaleFactor: number = 0.5;
  private translateX: number = 0;
  private translateY: number = 0;

  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;

  constructor(private domSanitizer: DomSanitizer) {
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    //
   }

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    if (this.canvas) {
      var ctx = this.canvas.getContext('2d');

      if (ctx != null){


        this.BGimage = "https://images.unsplash.com/photo-1604147495798-57beb5d6af73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YmxvY2slMjBiYWNrZ3JvdW5kfGVufDB8fDB8fA%3D%3D&w=1000&q=80";
        this.FGimage = "https://images.unsplash.com/photo-1582845512747-e42001c95638?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8ODUwMTAwNXx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=420&q=60";


        this.canvas.setAttribute('style', "background: url('https://images.unsplash.com/photo-1604147495798-57beb5d6af73?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YmxvY2slMjBiYWNrZ3JvdW5kfGVufDB8fDB8fA%3D%3D&w=1000&q=80'); background-repeat: no-repeat;");

        this.img.crossOrigin = 'Anonymous';

        this.img.src = this.FGimage;

        this.img.onload = () => {
          // Draw the image on the canvas
          this.draw();
          
  
          this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
          this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
          this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
          // this.canvas.addEventListener('wheel', this.onMouseWheel.bind(this));
        }

        this.imgX = this.canvas.width/2 - this.img.width/2;
        this.imgY = this.canvas.height/2 - this.img.height/2;
        this.imgWidth = this.img.width/2;
        this.imgHeight = this.img.height/2;

        // Draw the image on the canvas
        ctx.drawImage(this.img, this.imgX, this.imgY, this.imgWidth, this.imgHeight);

      }
  }

}

  async handleBackground(event: any) {

      event.preventDefault();
      const file = event.dataTransfer.files[0];

      const reader = new FileReader();
        reader.onload = (e: any) => {

          const base64Image = 'data:image/jpeg;base64,' + e.target.result.toString().split(',')[1];

          const canvas = <HTMLCanvasElement> document.getElementById('canvas');

          canvas.setAttribute('style', "background: url(\'" + base64Image + "\'); background-repeat: no-repeat; background-size: 100% auto;");
        };
        reader.readAsDataURL(file);
  }


  async handleForeground(event: any) {

    event.preventDefault();
    const file = event.dataTransfer.files[0];


    const reader = new FileReader();
    reader.onload = (e: any) => {

      const base64Image = 'data:image/jpeg;base64,' + e.target.result.toString().split(',')[1];

      //console.log(base64Image);

      this.img.src = base64Image;

      this.imgX = this.canvas.width/2 - this.img.width/2;
      this.imgY = this.canvas.height/2 - this.img.height/2;
      this.imgWidth = this.img.width/4;
      this.imgHeight = this.img.height/4;

      this.img.onload = () => {
        // Draw the image on the canvas
        this.draw();
        

        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        // this.canvas.addEventListener('wheel', this.onMouseWheel.bind(this));
      }



      // var ctx = this.canvas.getContext('2d');

      // if (ctx != null)
      // {

        
      //   ctx.drawImage(img, this.imgX, this.imgY, this.imgWidth, this.imgHeight);
      // }

    };
    reader.readAsDataURL(file);


  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  private draw() {

    

    var ctx = this.canvas.getContext('2d');
    if (ctx){
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Save the current context state
    ctx.save();

    // Translate the context to the center of the canvas
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

    // Apply the scale factor
    ctx.scale(this.scaleFactor, this.scaleFactor);

    // Translate the context to the current position
    ctx.translate(this.translateX, this.translateY);

    // Draw the image
    ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);

    // Restore the context state
    ctx.restore();
  }
}

private onMouseDown(event: MouseEvent) {
  // Check if the mouse is within the bounds of the image
  if (event.offsetX >= this.canvas.width / 2 - this.img.width / 2 &&
      event.offsetX <= this.canvas.width / 2 + this.img.width / 2 &&
      event.offsetY >= this.canvas.height / 2 - this.img.height / 2 &&
      event.offsetY <= this.canvas.height / 2 + this.img.height / 2) {
    this.isDragging = true;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
  }
}

private onMouseUp(event: MouseEvent) {
  this.isDragging = false;
}

private onMouseMove(event: MouseEvent) {
  if (this.isDragging) {
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;

    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;

    this.translateX += deltaX / this.scaleFactor;
    this.translateY += deltaY / this.scaleFactor;

      this.draw();
    }
  }

}

