let timer;

export function throttle(callback, time=200){
    if(!timer){
        timer = setTimeout(()=>{
            timer = null;
            callback();
        }, time);
    }
}