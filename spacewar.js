const canvas=document.querySelector('canvas')
const score=document.querySelector('#scoreEl')
// console.log(score)
const c=canvas.getContext('2d')

canvas.width=1024//to adjust window width
canvas.height=720  //to adjust window height

//Creating a player

class Player{
    constructor() {


/*As the player will move in both x and y axis, velocity is imparted
 in both x and y axis
 */
        this.velocity={
            x:0,
            y:0
        }
        this.opacity=1
        const image=new Image()
        image.src='./spaceship.png'
        //an arrow function basically to use a full loaded image 
        image.onload=()=>{
        this.image=image
        //shriks image by 0.15 x but maintains height and width ration of original image
        this.width=image.width *.15
        this.height=image.height *.15
        
        //initial position of player using position function
        this.position={
            x:canvas.width/2 - this.width/2,
            y:canvas.height - this.height -20
        }
     }        
    }

//if image is loaded set coordinates of spaceship
    draw(){  
        c.save()
        c.globalAlpha=this.opacity         
       c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
          )
          c.restore()
    }

update(){
    if(this.image) {
    this.draw()
    this.position.x += this.velocity.x
    }
}
}


/*Creating a new class projectile */

class Projectile{
    constructor({position,velocity}){
        this.position = position
         this.velocity= velocity
        this.radius = 4
    }
    draw(){
        c.beginPath()

        //method to crete an arc or full circle
        c.arc(this.position.x, this.position.y, this.radius,0,Math.PI*2)
       
        c.fillStyle='red'
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
/*class projectile ends here*/


//class particle begins here
class Particle{
    constructor({position,velocity,radius,color,fades}){
        this.position = position
         this.velocity= velocity
        this.radius = radius
        this.color=color
        this.opacity=1
        this.fades=fades
    }
    draw(){
        c.save()
        c.globalAlpha=this.opacity
        c.beginPath()

        //method to crete an arc or full circle
        c.arc(this.position.x, this.position.y, this.radius,0,Math.PI*2)
       
        c.fillStyle=this.color
        c.fill()
        c.closePath()
        c.restore()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if(this.fades)
        this.opacity -=0.01
    }
}

//class particle ends here

//invaderProjectile class begins here

class InvaderProjectile{
    constructor({position,velocity}){
        this.position = position
         this.velocity= velocity
         this.width=3
         this.height=10

    }
    draw(){
        c.fillStyle='white'
      c.fillRect(this.position.x, this.position.y,this.width,this.height)
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


///invaderProjectile class ends here


//creating invader class
class Invader{
    constructor({position}) {


/*As the invader will move in both x and y axis, velocity is imparted
 in both x and y axis */
        this.velocity={
            x:0,
            y:0
        }

        const image=new Image()
        image.src='./invader.png'
        //an arrow function basically to use a full loaded image 
        image.onload=()=>{
        this.image=image
        //shriks image by 0.15 x but maintains height and width ration of original image
        this.width=image.width *1
        this.height=image.height *1
               
        //initial position of player using position function
        this.position={
            x:position.x,
            y:position.y
        } 
           }        
    }

//if image is loaded set coordinates of spaceship
    draw(){           
       c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
          )
    }

update({velocity}){
    if(this.image) {
    this.draw()
    this.position.x += velocity.x
    this.position.y += velocity.y
    }
}
shoot(invaderProjectiles){
    invaderProjectiles.push(new InvaderProjectile({
        position:{
            x:this.position.x+this.width/2,
            y:this.position.y+this.height
        },
        velocity:{
            x:0,
            y:5
        }
    }))

}
}




//invader class ends

// Creating  a grid class for matrix of invaders //

class Grid{
    constructor(){
        this.position={
            x:0,
            y:0
        }

        this.velocity={
            x:3,
            y:0
        }

        this.invaders= []

        const cols=Math.floor(Math.random() *10 +5)
        const rows=Math.floor(Math.random() *5 +2)
        this.width=cols*30
        for(let i=0;i<10;i++){
            for(let y=0;y<rows;y++){
this.invaders.push(new Invader({position:{
    x:i*30,
    y:y*30
}}))
        }
    }
    console.log(this.invaders)
    }
    update(){
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        this.velocity.y=0

        if(this.position.x+this.width>=canvas.width ||this.position.x<=0){
            this.velocity.x=-this.velocity.x
            this.velocity.y=30
        }
    }
}


//Grid Class ends here//




const player=new Player()
const projectiles=[]
const grids= []
const invaderProjectiles=[]
const particles=[]
const keys={
    a:{
        pressed:false
    },
    d:{
        pressed:false

    },
    space:{
        pressed:false
    }
    
}

//to crete infite grids spawning continuously

let frames=0
let randomInterval= Math.floor((Math.random()*500)+500)
let game={
    over:false,
    active:true
}
let sco=0


//infite gris creation ends here

//stars effect code
for(let i=0;i<100;i++){
    particles.push(new Particle({
        position:{
            x:Math.random() *canvas.width,
            y:Math.random() *canvas.height
        },
        velocity:{
            x:0,
            y:0.3
        },
        radius:Math.random()*3,
        color:'white'   
    }))}   

//code ends here

//particle explosion effect function
function createParticles({object,color,fades}){
    for(let i=0;i<15;i++){
        particles.push(new Particle({
            position:{
                x:object.position.x+object.width/2,
                y:object.position.y+object.height/2
            },
            velocity:{
                x:(Math.random()-0.5)*2,
                y:(Math.random()-0.5)*2
            },
            radius:Math.random()*3,
            color:color || '#BAA0DE',
            fades
        }))}   
}

//loop function to repeatedly display spaceship
function animate(){
    if(!game.active) return
    requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0,0,canvas.width,canvas.height) //to fill background color onto the canvas
     player.update()
particles.forEach((particle,i)=>{
    if(particle.position.y-particle.radius>=canvas.height )
    {
        particle.position.x=Math.random() *canvas.width,
        particle.position.y=-particle.radius
       
    }
    if(particle.opacity<=0)
    {
        setTimeout(()=>{

        },0)
        particles.splice(i,1)}
        else
    particle.update()
})
     invaderProjectiles.forEach((invaderProjectile,index)=>{
        if(invaderProjectile.position.y+invaderProjectile.height>=canvas.height)
        {
            setTimeout(()=> { invaderProjectiles.splice(index,1)},0)
        }   
        else
        invaderProjectile.update()

        if(invaderProjectile.position.y+ invaderProjectile.height>=player.position.y &&
            invaderProjectile.position.x+invaderProjectile.width>=player.position.x &&
            invaderProjectile.position.x<=player.position.x+player.width)
            {
                console.log("YOU LOSE")
                setTimeout(()=> { invaderProjectiles.splice(index,1)
                player.opacity= 0
                game.over=true
                },0)

                setTimeout(()=> { 
                game.active=false
                },2000)
                
                createParticles({object:player,color:'white',fades:true})
            }
     })

    //creating multiple projectiles
    projectiles.forEach(projectile =>{
        projectile.update()
    })

    grids.forEach(grid=>{
        grid.update()
        if(frames %100===0 && grid.invaders.length>0)
     grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(invaderProjectiles)

        grid.invaders.forEach((invader,i)=>{
            invader.update({velocity: grid.velocity})

            projectiles.forEach((projectile,j)=>{
                if(projectile.position.y -projectile.radius<= invader.position.y+invader.height  
                    &&projectile.position.x+projectile.radius>=invader.position.x
                    && projectile.position.x- projectile.radius <=invader.position.x+invader.width
                    && projectile.position.y+projectile.radius>=invader.position.y){
                    
                        

                        setTimeout(()=>{
                        const invaderFound = grid.invaders.find(invader2 => invader2 ===invader)
                        const projectileFound=projectiles.find(projectile2=>projectile2===projectile)
                        if(invaderFound &&projectileFound){
                            sco+=100
                            // console.log(sco)
                            score.innerHTML=sco
                            createParticles({object:invader,fades:true})
                           
                        grid.invaders.splice(i,1)
                        projectiles.splice(j,1)

                        if(grid.invaders.length >0){
                            const firstInvader=grid.invaders[0]
                            const lastInvader=grid.invaders[grid.invaders.length -1]
                            grid.width=lastInvader.position.x-firstInvader.position.x+lastInvader.width
                            grid.position.x=firstInvader.position.x
                        }                       
                        }
                    },0)
                }
            })

        })
    })


    //Increasing or decreasing player velocity upon keypress
    if(keys.a.pressed && player.position.x>=0){
        player.velocity.x = -5
    }
    else if(keys.d.pressed  &&player.position.x +player.width<=canvas.width){
player.velocity.x = 5
    }
    else{
    player.velocity.x=0
}

if(frames%  randomInterval=== 0){
    grids.push(new Grid())
     randomInterval= Math.floor((Math.random()*500)+500)
     frames=0}
     
frames++
}
animate()

addEventListener('keydown',({key})=>{
if(game.over) return

    switch(key){
        case 'a':
            // console.log('left')
            keys.a.pressed=true
            break
        case 'd':
            // console.log('right')
            keys.d.pressed=true
            break
        case ' ':
            // console.log('space') 
            projectiles.push(new Projectile({
                position:{
                    x:player.position.x+ player.width/2,
                    y:player.position.y
                },
                velocity: {
                    x:0,
                    y:-10
                }
            }))          
            break        
    }
})

addEventListener('keyup',({key})=>{
    switch(key){
        case 'a':
            console.log('left')
            keys.a.pressed=false
            break
        case 'd':
            console.log('right')
            keys.d.pressed=false
            break
        case ' ':
            console.log('space')           
            break        
    }
})