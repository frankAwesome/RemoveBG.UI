import { style } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Background } from 'tsparticles-engine';

@Component({
  selector: 'app-editimage',
  templateUrl: './editimage.component.html',
  styleUrls: ['./editimage.component.sass']
})
export class EditimageComponent implements OnInit {

  fileToUpload: File | null = null;

  BGimage = '';
  FGimage = '';
  canvas: HTMLCanvasElement;
  private img = new Image;

  private scaleFactor: number = 1;
  private translateX: number = 0;
  private translateY: number = 0;

  private isDragging: boolean = false;
  private isResizing: boolean = false;

  imgX = 0;
  imgY = 0;
  imgWidth = 0;
  imgHeight = 0;
  prevX = 0; 
  prevY = 0;

  releasePrevX = 0; 
  releasePrevY = 0;


  startUp = false;

  imgRatio = 3;

  base64Image = ''
  backgroundBase64Image = ''
  canvasWidth = 612;
  canvasHeight = 428;

  foreClicked = false;
  coordinatesChanged = false;

  constructor(private domSanitizer: DomSanitizer) {
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    //
   }

  ngOnInit(): void {
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    if (this.canvas) {
      var ctx = this.canvas.getContext('2d');

      if (ctx != null){


        this.BGimage = "../../assets/img/bmw.jpg";
        this.FGimage = "../../assets/img/image2.png";

        this.base64Image = this.FGimage;


        this.canvas.setAttribute('style', "background: url(\'" + "../../assets/img/bmw.jpg" + "\'); background-repeat: no-repeat; background-size: 100% 100%;");

        this.img.crossOrigin = 'Anonymous';

        this.img.src = this.FGimage;



        this.img.onload = () => {
          // Draw the image on the canvas
          this.imgX = this.canvas.width/2 - this.img.width/2/this.imgRatio;
          this.imgY = this.canvas.height/2 - this.img.height/2/this.imgRatio;
          this.imgWidth = this.img.width/this.imgRatio;
          this.imgHeight = this.img.height/this.imgRatio;


          this.draw();
          
  
          this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
          this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
          this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        }


      }
  }

}

  async handleBackground(event: any) {

      event.preventDefault();
      const file = event.dataTransfer.files[0];

      const reader = new FileReader();
        reader.onload = (e: any) => {

          const base64Image = 'data:image/jpeg;base64,' + e.target.result.toString().split(',')[1];

          this.backgroundBase64Image = base64Image;

          var img = new Image;
          img.src = base64Image;

          img.onload = () => {
            this.canvasWidth = img.width;
            this.canvasHeight = img.height;
            this.canvas.height = img.height;
            this.canvas.width = img.width;

            this.canvas.setAttribute('style', "background: url(\'" + base64Image + "\'); background-repeat: no-repeat; background-size: 100% 100%;");
      
            this.img.src = this.base64Image;
      
            this.imgX = this.canvas.width/2 - this.img.width/2/this.imgRatio;
            this.imgY = this.canvas.height/2 - this.img.height/2/this.imgRatio;
            this.imgWidth = this.img.width/this.imgRatio;
            this.imgHeight = this.img.height/this.imgRatio;

      
            this.img.onload = () => {
              this.draw();
            }
      
          }
        };

        reader.readAsDataURL(file);   
  }


  async handleForeground(event: any) {

    event.preventDefault();
    const file = event.dataTransfer.files[0];

    const reader = new FileReader();
    reader.onload = (e: any) => {

    this.base64Image = 'data:image/jpeg;base64,' + e.target.result.toString().split(',')[1];

    this.img.src = this.base64Image;

    this.img.onload = () => {

      this.foreClicked = false;
      this.coordinatesChanged = false;

      this.imgX = this.canvas.width/2 - this.img.width/2/this.imgRatio;
      this.imgY = this.canvas.height/2 - this.img.height/2/this.imgRatio;
      this.imgWidth = this.img.width/this.imgRatio;
      this.imgHeight = this.img.height/this.imgRatio;
      this.startUp = false;
      this.draw();

      this.startUp = true;


    }

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
    ctx.save();
    // ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    // ctx.scale(this.scaleFactor, this.scaleFactor);
    // ctx.translate(this.translateX, this.translateY);



    if (this.startUp)
    {
      if (this.foreClicked)
      {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "lightblue";
        ctx.rect(this.imgX - this.canvas.width/2 - 10, this.imgY - this.canvas.height/2 - 10, this.imgWidth + 20, this.imgHeight + 20);
        ctx.stroke();
      }
      ctx.drawImage(this.img, this.imgX - this.canvas.width/2, this.imgY - this.canvas.height/2, this.imgWidth, this.imgHeight);
      
    }
    else
    {
      if (this.foreClicked)
      {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "lightblue";
        ctx.rect(this.imgX + 10, this.imgY + 10, this.imgWidth - 20, this.imgHeight - 20);
        ctx.stroke();
      }
      this.imgX = this.canvas.width/2 - this.img.width/2/this.imgRatio;
      this.imgY = this.canvas.height/2 - this.img.height/2/this.imgRatio;
      ctx.drawImage(this.img, this.imgX, this.imgY, this.imgWidth, this.imgHeight);

      this.startUp = true;

    }

    
    ctx.restore();
  }
}

private onMouseDown(event: MouseEvent) {

  this.isDragging = true;
}

private onMouseUp(event: MouseEvent) {
  this.isDragging = false;
  this.isResizing = false;

  console.log(this.releasePrevX + ' ' + event.offsetX + ' ' + this.releasePrevY + ' ' + event.offsetY)

  if ((this.releasePrevX != event.offsetX) || (this.releasePrevY != event.offsetY))
  {
    this.coordinatesChanged = true
    // this.foreClicked = true;
  }
  else{
    this.coordinatesChanged = false
  }

  if (this.foreClicked == false && this.coordinatesChanged == false)
  {
    this.foreClicked = true
  }
  else if (this.foreClicked == true && this.coordinatesChanged == false)
  {
    this.foreClicked = false
  }

  this.draw();
  this.releasePrevX = event.offsetX;
  this.releasePrevY = event.offsetY;
  this.coordinatesChanged = false;
}

private onMouseMove(event: MouseEvent) {
  if (this.isDragging && !this.foreClicked) {

      var deltaX = event.offsetX - this.prevX;
      var deltaY = event.offsetY - this.prevY;
      this.imgX += deltaX;
      this.imgY += deltaY;
      this.prevX = event.offsetX;
      this.prevY = event.offsetY;

      this.draw();
    }

    if (this.foreClicked) {

      this.imgWidth = event.offsetX;
      this.imgHeight = event.offsetY;

      this.draw();
        
    }

  }

    handleCanvasClick(event: MouseEvent) {

    }



    handleDownloadClick(event: MouseEvent) {

      var c = <HTMLCanvasElement> document.createElement('canvas');

      if (c)
      {
        var ctx = c.getContext("2d");

        if (ctx)
        {
      
          var img3 = new Image();
          img3.crossOrigin = 'Anonymous';
          if (this.backgroundBase64Image != '')
          {img3.src = this.backgroundBase64Image;}
          else
          {img3.src = '../../assets/img/bmw.jpg';}

          img3.onload = () => {
            c.height = img3.height;
            c.width = img3.width;

            if (ctx){
              ctx.drawImage(img3, 0, 0);
              // ctx.restore();
              // ctx.save();
            }  

            var img2 = new Image();
            img2.crossOrigin = 'Anonymous';
            img2.src = this.base64Image;
            img2.onload = () => {
              if (ctx){
                //console.log(img2.src)
                ctx.drawImage(img2, this.imgX, this.imgY, this.imgWidth, this.imgHeight)
                ctx.restore();
                ctx.save();

                const link = document.createElement('a');
                link.download = 'download.png';
                link.href = c.toDataURL('image/png');
                link.click();
              }             
            };


          };

        
        }
      }
    }
  }
