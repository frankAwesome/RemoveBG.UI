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
  private isResizing: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;


  private b4dragStartX: number = 0;
  private b4dragStartY: number = 0;

  base64Image = ''


  canvasWidth = 800;
  canvasHeight = 600;

  foreClicked = true;

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


        this.BGimage = "../../assets/img/bmw.jpeg";
        this.FGimage = "../../assets/img/image2.png";

        this.base64Image = this.FGimage;


        this.canvas.setAttribute('style', "background: url(\'" + "../../assets/img/bmw.jpg" + "\'); background-repeat: no-repeat; background-size: 100% 100%;");

        this.img.crossOrigin = 'Anonymous';

        this.img.src = this.FGimage;

        this.imgX = this.canvas.width/2 - this.img.width/2;
        this.imgY = this.canvas.height/2 - this.img.height/2;
        this.imgWidth = this.img.width/2;
        this.imgHeight = this.img.height/2;

        this.img.onload = () => {
          // Draw the image on the canvas
          this.draw();
          
  
          this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
          this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
          this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
          // this.canvas.addEventListener('wheel', this.onMouseWheel.bind(this));
        }



        // Draw the image on the canvas
        //ctx.drawImage(this.img, this.imgX, this.imgY, this.imgWidth, this.imgHeight);

      }
  }

}

  async handleBackground(event: any) {

      event.preventDefault();
      const file = event.dataTransfer.files[0];

      const reader = new FileReader();
        reader.onload = (e: any) => {

          const base64Image = 'data:image/jpeg;base64,' + e.target.result.toString().split(',')[1];

          var img = new Image;
          img.src = base64Image;

          img.onload = () => {
            this.canvasWidth = img.width;
            this.canvasHeight = img.height;

            this.imgX = this.canvasWidth / 2  - this.img.width/2;
            this.imgY = this.canvasHeight / 2  - this.img.height/2;

            this.canvas.setAttribute('style', "background: url(\'" + base64Image + "\'); background-repeat: no-repeat; background-size: 100% 100%;");

            //console.log(base64Image);
      
            this.img.src = this.base64Image;
      
            this.imgX = this.canvas.width/2 - this.img.width/2;
            this.imgY = this.canvas.height/2 - this.img.height/2;
            this.imgWidth = this.img.width/4;
            this.imgHeight = this.img.height/4;
      
            this.img.onload = () => {
              this.draw();

              
      
              // this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
              // this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
              // this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
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

      //console.log(base64Image);

      this.img.src = this.base64Image;

      this.imgX = this.canvas.width/2 - this.img.width/2;
      this.imgY = this.canvas.height/2 - this.img.height/2;
      this.imgWidth = this.img.width/4;
      this.imgHeight = this.img.height/4;

      this.img.onload = () => {
        // Draw the image on the canvas
       

        // this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        // this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        // this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));

        this.foreClicked = true;
        this.coordinatesChanged = false;
        this.b4dragStartX  = 0
        this.b4dragStartY  = 0

        this.draw();
      }


    };
    reader.readAsDataURL(file);


  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  private draw() {

    

    var ctx = this.canvas.getContext('2d');

    console.log(ctx)
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


if (this.foreClicked)
{
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.strokeStyle = "lightblue";
  ctx.rect(this.img.x + (this.img.width / 2) + 10, this.img.y + (this.img.height / 2) + 10, -this.img.width - 20, -this.img.height - 20);
  ctx.stroke();
}


    console.log(-this.img.width / 2)
    console.log(-this.img.height / 2)

    // Draw the image
    ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2);

    // Restore the context state
    ctx.restore();
  }
}

private onMouseDown(event: MouseEvent) {

  this.isDragging = true;
  this.dragStartX = event.clientX;
  this.dragStartY = event.clientY;

  // if (this.imgX < 0)
  // {
  //   this.imgX=this.imgX*-1
  // }

  // if (this.imgY < 0)
  // {
  //   this.imgY=this.imgY*-1
  // }


  // console.log(event.offsetX )
  // console.log(this.imgX)
  // console.log(this.imgX+ this.img.width)
  

  // console.log(event.offsetY )
  // console.log(this.imgY)
  // console.log(this.imgY + this.img.height)



  // if (event.offsetX >= this.imgX &&
  //     event.offsetX <= this.imgX + this.img.width &&
  //     event.offsetY >= this.imgY  &&
  //     event.offsetY <= this.imgY + this.img.height) {
  //   this.isDragging = true;
  //   this.dragStartX = event.clientX;
  //   this.dragStartY = event.clientY;
  //   console.log(this.isDragging )



  // }

  this.b4dragStartX = event.clientX;
  this.b4dragStartY = event.clientY;
  




//   if (event.offsetX >= this.imgX && event.offsetX <= this.imgX + this.imgWidth && event.clientY>= this.imgY && event.clientY <= this.imgY + this.imgHeight) {
//     this.isDragging = true;
//     this.isResizing = false;
//     this.dragStartX = event.clientX;
//     this.dragStartY = event.clientY;
// }
// else if (event.offsetX >= this.imgX + this.imgWidth - 10 && event.offsetX <= this.imgX + this.imgWidth && event.clientY>= this.imgY + this.imgHeight - 10 && event.clientY <= this.imgY + this.imgHeight) {
//   this.isResizing = true;
//   this.isDragging = false;
// }



}

private onMouseUp(event: MouseEvent) {
  this.isDragging = false;
  this.isResizing = false;


  this.imgX = event.offsetX ;
  this.imgY = event.offsetY ;


  console.log(event.offsetX )
  console.log(this.imgX)
  

  console.log(event.offsetY )
  console.log(this.imgY)



  console.log(this.b4dragStartX + ' ' + event.clientX)

  if ((this.b4dragStartX != event.clientX) || (this.b4dragStartY != event.clientY))
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


console.log(this.foreClicked )


  this.draw();




  this.coordinatesChanged = false;


}

private onMouseMove(event: MouseEvent) {
  if (this.isDragging && !this.foreClicked) {
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;

    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;

    this.translateX += deltaX / this.scaleFactor;
    this.translateY += deltaY / this.scaleFactor;

      this.draw();
    }

    if (this.foreClicked) {
        // this.imgWidth = event.clientX - this.dragStartX;
        // this.imgHeight = event.clientY - this.dragStartY;



        this.draw();
        
    }
    }




    handleCanvasClick(event: MouseEvent) {

    }
  }


