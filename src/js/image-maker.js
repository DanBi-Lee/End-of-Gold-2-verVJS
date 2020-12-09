import tab from './lib/tab-menu';

window.addEventListener('load', ()=>{
    function tabMenuInFontBox(){
        const $headerFont = document.querySelector('.header-font');
        const $headerFont_li = document.querySelectorAll('.header-font > li');
        const $contentsFont_li = document.querySelectorAll('.contents-font > li');

        $headerFont.addEventListener('click', e => {
            const target = e.target;
            tab(target, $headerFont_li,  $contentsFont_li, "contents-font");
        });
    }

    function tabMenu(){
        const $stepList = document.querySelector('.step-list');
        const $stepList_li = document.querySelectorAll('.step-list > li');
        const $optionBox_li = document.querySelectorAll('.option_box > li');

        $stepList.addEventListener('click', e => {
            const target = e.target;
            tab(target, $stepList_li,  $optionBox_li, "option_box");
        });
    }

    function init(){
        tabMenuInFontBox();
        tabMenu();
    }

    init();
})
