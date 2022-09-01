function random(min , max){
    return Math.floor(Math.random() * (max - min)) + min
}

// function randomColor(){
//     const c = () => random(0, 256);
//     return `rgba(${c()}, ${c()}, ${c()} , ${random(0.5, 1)})`
// }

function randomColor(){
    const colors = ["#404e5c", "#4f6272", "#b7c3f3", "#dd7596", "#cf1259"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function randomDirection(n){
    return Math.random() > 0.5 ? n : -n;
}

const WIDTH = window.innerWidth - 4;
const HEIGHT = window.innerHeight - 4;

function createParticles(count){
    let particles = [];

    for(let i = 0; i < count ; i++){
        particles.push(Particle.create());
    }

    return particles;
}

function runAnimation(frameFn){
    let lastTime = null;

    function animate(time){
        if(lastTime){
            let interval = Math.min(time - lastTime, 100) / 1000;
            frameFn(interval);
        }
        lastTime = time;
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

class Particle{
    constructor(props){
        this.x = props.x;
        this.y = props.y;
        this.r = props.r;
        this.vx = props.vx;
        this.vy = props.vy;
        this.color = props.color;
    }

    update(time){
        if(this.x + this.r > WIDTH || this.x - this.r < 0 ){
            this.vx = -this.vx
        }else if(this.y + this.r > HEIGHT || this.y - this.r < 0 ){
            this.vy = -this.vy
        }
        this.x += (this.vx * time)
        this.y += (this.vy * time)
    }

    static create(){
        const r = random(2, 45);
        return new Particle({
            x: random(0 + r, WIDTH - r),
            y: random(0 + r, HEIGHT - r),
            r,
            vx: randomDirection(random(50, 90)), 
            vy: randomDirection(random(50, 90)), 
            color: randomColor()
        })
    }
}

class CanvasDisplay{
    constructor(){
        this.canvas = document.createElement("canvas");
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d")
    }

    syncState(particles){
        this.ctx.clearRect(0 , 0 , this.canvas.width , this.canvas.height)
        particles.forEach(particle => this.draw(particle))
    }

    draw(particle){
        this.ctx.beginPath()
        this.ctx.arc(particle.x , particle.y , particle.r , 0 , Math.PI*2 , false)
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        this.ctx.closePath()
    }
}

class HTMLDisplay{
    constructor(){
        this.playground = this.createPlayground();
    }
    syncState(particles){
        this.playground.remove();
        this.playground = this.createPlayground();
        particles.forEach(particle => this.draw(particle))
        document.body.appendChild(this.playground)
    }


    draw(particle){
        let div = document.createElement("div");

        div.style.position = "absolute";
        div.style.width = `${2 * particle.r}px`;
        div.style.height= `${2 * particle.r}px`;
        div.style.backgroundColor = particle.color;
        div.style.borderRadius = "50%";
        div.style.top = `${particle.y - particle.r}px`;
        div.style.left = `${particle.x - particle.r}px`;

        this.playground.appendChild(div)
    }

    createPlayground(){
        let playground = document.createElement("div");
        playground.style.height = `${HEIGHT}px`;
        playground.style.width = `${WIDTH}px`;
        return playground;
    }
}

// client code
function runApp(display){
    const particles = createParticles(300);

    runAnimation(time => {
        particles.forEach(particle => particle.update(time));
        display.syncState(particles);
    });
}

runApp(new CanvasDisplay());
// runApp(new HTMLDisplay());