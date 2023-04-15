// import { style } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ForegroundService } from 'src/app/services/foreground.service';
import { colorMix } from 'tsparticles-engine';
// import { Background } from 'tsparticles-engine';

@Component({
  selector: 'app-editimage',
  templateUrl: './editimage.component.html',
  styleUrls: ['./editimage.component.sass']
})

export class EditimageComponent implements OnInit {

  fileToUpload: File | null = null;

  subscription: Subscription;

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

  hideDropBox = true;
  

  // foreground image properties
  private foregroundimage = new Image;
  private foregroundimageX: number = 0;
  private foregroundimageY: number = 0;
  private foregroundimageW: number = 0;
  private foregroundimageH: number = 0;


  //browser window properties
  private browserwindowW: number = 0;
  private browserwindowH: number = 0;

  //show/hide UXtext
  hideElement = false;
  UserUX = 0;

  startUp = false;

  imgRatio = 3;

  base64Image = ''
  backgroundBase64Image = ''
  canvasWidth = 800;
  canvasHeight = 600;

  foreClicked = true;
  coordinatesChanged = false;

  constructor(private domSanitizer: DomSanitizer, private myService: ForegroundService) {
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');

    this.subscription = this.myService.currentMessage.subscribe(message => this.FGimage = message)
   }


  ngOnInit(): void {
    
    this.canvas = <HTMLCanvasElement> document.getElementById('canvas');
    if (this.canvas) {
      var ctx = this.canvas.getContext('2d');

      if (ctx != null){
        this.BGimage = "../../assets/img/bmw.jpg";

        this.subscription = this.myService.currentMessage.subscribe(message => this.FGimage = message);

        this.base64Image = this.FGimage;

        this.img.crossOrigin = 'Anonymous';
        this.img.src = this.FGimage;

        this.img.onload = () => {
          // Draw the image on the canvas
          this.imgX = this.canvas.width/2 - this.img.width/2/this.imgRatio;
          this.imgY = this.canvas.height/2 - this.img.height/2/this.imgRatio;
          this.imgWidth = this.img.width/this.imgRatio;
          this.imgHeight = this.img.height/this.imgRatio;

           //set foreground image properties
          this.foregroundimage = this.img;
          this.foregroundimageX = this.imgX;
          this.foregroundimageY = this.imgY;
          this.foregroundimageW = this.imgWidth;
          this.foregroundimageH = this.imgHeight;

          this.UserUX=0;
          //guide the user that they can do something with the image
          this.draw(0);
          // this.foreClicked=false;

          this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
          this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
          this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        }
      }
  }
  }



 //------------------------------------------BACKGROUND IMAGE----------------------------------------------

  async handleBackground(event: any) {

      event.preventDefault();
      const file = event.dataTransfer.files[0];

    //get browser window size for foreground image position
    this.browserwindowW = window.innerWidth;
    this.browserwindowH = window.innerHeight;

      const reader = new FileReader();
        reader.onload = (e: any) => {

          const base64Image = 'data:image/jpeg;base64,' + e.target.result.toString().split(',')[1];

          this.backgroundBase64Image = base64Image;

          var img = new Image;
          img.src = base64Image;

          img.onload = () => {


            // this.canvasWidth = img.width;
            // this.canvasHeight = img.height;
            // this.canvas.height = img.height;
            // this.canvas.width = img.width;
            

            this.canvas.setAttribute('style', "background: url(\'" + base64Image + "\'); background-repeat: no-repeat; background-size: 100% 100%;");
      
            this.img.src = this.base64Image;
      
            this.img.onload = () => {       
              this.coordinatesChanged = false;

              ////get from foreground image properties            
              this.imgX = this.foregroundimageX;
              this.imgY = this.foregroundimageY;

              this.imgWidth = this.foregroundimageW ;
              this.imgHeight = this.foregroundimageH;
     
              this.draw(0);

            }
          }
        };

        //Reset for background image??
        this.foreClicked = false
        this.hideElement = true

        this.hideDropBox = false
        reader.readAsDataURL(file);   
  }



 //------------------------------------------FOREGROUND IMAGE----------------------------------------------

  // async handleForeground(event: any) {

  //   event.preventDefault();
  //   const file = event.dataTransfer.files[0];

  //   const reader = new FileReader();
  //   reader.onload = (e: any) => {

  //   this.base64Image = 'data:image/jpeg;base64,' + e.target.result.toString().split(',')[1];

  //   this.img.src = this.base64Image;

  //   this.img.onload = () => {

  //     this.foreClicked = false;
  //     this.coordinatesChanged = false;

  //     this.imgX = this.canvas.width/2 - this.img.width/2/this.imgRatio;
  //     this.imgY = this.canvas.height/2 - this.img.height/2/this.imgRatio;
  //     this.imgWidth = this.img.width/this.imgRatio;
  //     this.imgHeight = this.img.height/this.imgRatio;
  //     this.startUp = false;
  //     this.draw(0);
  //     this.startUp = true;
  //   }

  //   //set foreground image properties
  //   this.foregroundimage = this.img;
  //   this.foregroundimageX = this.imgX;
  //   this.foregroundimageY = this.imgY;
  //   this.foregroundimageW = this.imgWidth;
  //   this.foregroundimageH = this.imgHeight;

  //   };
  //   reader.readAsDataURL(file);
  // }


  onDragOver(event: any) {
    event.preventDefault();
  }


//------------------------------------------CANVAS EVENTS----------------------------------------------

  private draw(degrees: number) {
    var ctx = this.canvas.getContext('2d');

    if (ctx){
              ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              ctx.save();
             
              //DRAW A BORDER FOR THE USER TO BE ABLE TO SELECT THE CORNER FOR RESIZE
              if (this.foreClicked)
              {
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = "white";                
                ctx.setLineDash([3]);
                ctx.rect(this.imgX - 25, this.imgY - 25, this.imgWidth + 50, this.imgHeight + 50);      
                ctx.stroke();
              }

              //UX - GUIDE USER TO RESIZE IMAGE
              this.hideElement = this.foreClicked
     
              //FIX THE ROTATION OF PROCESSED IMAGE
              // if (degrees!=0){
              //   // rotate the canvas to the specified degrees
              //   ctx.setTransform(1, 0, 0, 1, x, y); // sets scale and origin
              //   ctx.rotate(degrees*Math.PI/180);
              // }
              // else {
                
              // }

              //CENTRE IMAGE AFTER 1ST UPLOAD
              if (this.startUp == true)
              {
                this.imgX = this.canvas.width/2 - this.img.width/2/this.imgRatio;
                this.imgY = this.canvas.height / 2 - this.img.height / 2 / this.imgRatio;
                this.startUp = false;
              }
          
              ctx.drawImage(this.img, this.imgX, this.imgY, this.imgWidth, this.imgHeight);       
              ctx.restore();
            }
  }


  //NOT USED
  handleCanvasClick(event: MouseEvent) {

  }



//------------------------------------------MOUSE EVENTS----------------------------------------------

private onMouseDown(event: MouseEvent) {
  this.isDragging = false;
  this.isResizing = false;

  //only enable when user clicks inside image
  if (event.offsetX <= this.imgX + this.imgWidth && (event.offsetX >= this.imgX)) {
    if (event.offsetY <= this.imgY + this.imgHeight && (event.offsetY >= this.imgY)) {
      this.isDragging = true;
    }
  }

      if (this.isDragging)
      {
        this.releasePrevX = event.offsetX;
        this.releasePrevY = event.offsetY;
      }

      this.prevX = event.offsetX;
      this.prevY = event.offsetY; 


  if (this.foreClicked){

    //only enable when user clicks and drags inside image corners

  //  TOP LEFT CORNER
  if (event.offsetX > this.imgX -25){
    if (event.offsetY > this.imgY-25){
      if (event.offsetX < this.imgX -10){
        if (event.offsetY < this.imgY-10){
          this.isResizing = true;
        }
      }
    }
  }

     //TOP RIGHT CORNER
     if (event.offsetX > this.imgX + this.imgWidth - 10){
      if (event.offsetY > this.imgY -25){
     
        if (event.offsetX < this.imgX + this.imgWidth +25){
          if (event.offsetY < this.imgY+10){
            this.isResizing = true;
          }
        } 
   }
  }

      // //BOTTOM LEFT CORNER
      if (event.offsetX > this.imgX -25){
        if (event.offsetY > this.imgY + this.imgHeight - 25 ){
          if (event.offsetX < this.imgX + 25){
            if (event.offsetY < this.imgY + this.imgHeight +25){
              this.isResizing = true;
            }
          }
        }
      }
      
    //BOTTOM RIGHT CORNER
    if (event.offsetX > this.imgX + this.imgWidth - 10){
    if (event.offsetY > this.imgY+ this.imgHeight - 10 ){
      if (event.offsetX < this.imgX + this.imgWidth + 25){
        if (event.offsetY < this.imgY+ this.imgHeight + 25 ){
          this.isResizing = true;
        }
      }
    }
  }



    // if (event.offsetX <= this.imgX + this.imgWidth  && (event.offsetX >= this.imgX )) {
    //   if (event.offsetY <= this.imgY + this. imgHeight && (event.offsetY >= this.imgY )) {
    //     this.isResizing = true;
    //   }
    // }

}
}




private onMouseUp(event: MouseEvent) {
  this.isDragging = false;
  this.isResizing = false;

  if (event.offsetX <= this.imgX + this.imgWidth && (event.offsetX >= this.imgX)) {
    if (event.offsetY <= this.imgY + this.imgHeight && (event.offsetY >= this.imgY)) {
                        
          //CHECK IF IMAGE WAS MOVED WHILE THE MOUSE WAS DOWN
          if ((this.releasePrevX > event.offsetX) || (this.releasePrevY > event.offsetY) || (this.releasePrevX < event.offsetX) || (this.releasePrevY < event.offsetY))
          {
            this.coordinatesChanged = true
          }
          else{
            this.coordinatesChanged = false
          }

          if (this.coordinatesChanged == false) {
            if (this.foreClicked == false){
              //HIDE BORDER AROUND IMAGE
              this.foreClicked = true;
            }
            else
            {
              //SHOW BORDER AROUND IMAGE
              this.foreClicked = false;      
            }
          }

          this.prevX = event.offsetX;
          this.prevY = event.offsetY;

          this.draw(0);               
       }; 
   };

  this.coordinatesChanged = false

}




private onMouseMove(event: MouseEvent) {

  //DRAG AND MOVE IMAGE AROUND
  if (this.isDragging && !this.foreClicked) {

        var deltaX = event.offsetX - this.prevX;
        var deltaY = event.offsetY - this.prevY;

        this.imgX += deltaX;
        this.imgY += deltaY;

        this.prevX = event.offsetX;
        this.prevY = event.offsetY;

          this.draw(0);
      }
    else 
        if (this.isResizing && this.foreClicked) {

        //DRAW IMAGE AGAIN BASED ON RESIZE
        //  console.log('DRAG MOVE!')

        var deltaX = event.offsetX - this.prevX;
        var deltaY = event.offsetY - this.prevY;
    
        //  this.imgX += deltaX;
        //  this.imgY += deltaY;
    
        this.prevX = event.offsetX;
        this.prevY = event.offsetY;

        this.imgWidth = this.imgWidth + (deltaX)
        this.imgHeight = this.imgHeight + (deltaY)
      
        this.draw(0);
      }


// UX
    // if (event.offsetX <= this.imgX + this.imgWidth && (event.offsetX >= this.imgX)) {
    //   if (event.offsetY <= this.imgY + this.imgHeight && (event.offsetY >= this.imgY)) {

    //       if (this.foreClicked==false) {
    //         if (this.isDragging ==false) 
    //         {              
          
    //           //guide the user to understand that they can do something with the image
    //           if (this.UserUX == 0)
      
    //           this.UserUX = 1

    //         }        
    //       }
    //       else
    //       {   
    //         if (this.UserUX == 1)
    //         {
    //           console.log('EVEN BETTER')
    //           this.UserUX = 2
    //         }
    //       }
    //   }
    // }
 }


  // private SetUXText(){

    

  //   }
  




   //------------------------------------------DOWNLOADS----------------------------------------------

    handleDownloadClick(event: MouseEvent) {

console.log( this.backgroundBase64Image)

      if (this.backgroundBase64Image == '' || this.backgroundBase64Image == null){

console.log('!=')
        const byteString = atob(this.base64Image.split(',')[1]);
        const mimeString = this.base64Image.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
  
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
          
        // Create an anchor element to download the image
        const a = document.createElement('a');
        a.href = url;
        a.download = 'image.png';
        
        // Click the anchor element to download the image
        a.click();
        
        // Release the URL object
        window.URL.revokeObjectURL(url);
  
        
      }
      else
      {

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



    // handleForegroundDownloadClick(event: MouseEvent) {

    //   const byteString = atob(this.base64Image.split(',')[1]);
    //   const mimeString = this.base64Image.split(',')[0].split(':')[1].split(';')[0];
    //   const ab = new ArrayBuffer(byteString.length);
    //   const ia = new Uint8Array(ab);
    //   for (let i = 0; i < byteString.length; i++) {
    //       ia[i] = byteString.charCodeAt(i);
    //   }
    //   const blob = new Blob([ab], { type: mimeString });

    //   // Create a URL for the blob
    //   const url = window.URL.createObjectURL(blob);
        
    //   // Create an anchor element to download the image
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'image.png';
      
    //   // Click the anchor element to download the image
    //   a.click();
      
    //   // Release the URL object
    //   window.URL.revokeObjectURL(url);
    //   };
  }
