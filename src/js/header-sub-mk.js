window.addEventListener("load", ()=>{
    const $btnBox = document.querySelector('.btn-box');
    const $body = document.querySelector('body');
    const $btnFullscreenExit = document.querySelector('.btn-fullscreen-exit');
    const $btnFullscreenRequest = document.querySelector('.btn-fullscreen-request');
    
    function handlingScreenButton(){
        $btnBox.addEventListener("click", e =>{
            const _target = e.target;
            if(_target.nodeName !== "BUTTON"){
                return;
            } else if (_target === $btnFullscreenRequest){
                $body.requestFullscreen();
                $btnFullscreenRequest.classList.remove("on");
                $btnFullscreenExit.classList.add("on");
            } else if (_target === $btnFullscreenExit){
                document.fullscreenElement && document.exitFullscreen();
                $btnFullscreenExit.classList.remove("on");
                $btnFullscreenRequest.classList.add("on");
            }
        });
    }
    
    const $preview = document.querySelector('.preview');
    const $imageDom = document.querySelector('.imageDom');
    const CARD_WIDTH = 1040;
    const CARD_HEIGHT = 640;
    const CARD_RATE = CARD_WIDTH/CARD_HEIGHT;

    function setCardSize(){
        const preview_width = $preview.clientWidth;
        const preview_height = $preview.clientHeight;
        const preview_rate = preview_width/preview_height;
            
        if(preview_width > CARD_WIDTH && preview_rate < CARD_RATE ){
            return;
        }

        if(preview_rate > CARD_RATE){
            const scale = (preview_height - 40)/CARD_HEIGHT;
            $imageDom.style.transform = `scale(${scale})`;
        }else{
            const scale = (preview_width - 40)/CARD_WIDTH;
            $imageDom.style.transform = `scale(${scale})`;
        }
    }

    function handlingCardSize(){
        window.addEventListener("resize", e => {
            setCardSize();
        });
    }

    function init(){
        handlingScreenButton();
        handlingCardSize();
        setCardSize();
    }

    init();
});