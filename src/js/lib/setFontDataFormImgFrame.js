import {loadData, saveData} from '../partials/dataManagementForImageFrame';
import {rule} from '../partials/loadHTML';

const imgFrameData = loadData(rule);
const $fontBox = document.querySelector('.font-box .contents-font');
const $fontBox_main = $fontBox.querySelector('.main > .font-list');
const $fontBox_sub = $fontBox.querySelector('.sub > .font-list');

async function loadFont(){
    let result;
    try{
        const response = await fetch('./data/fonts.json');
        const data = await response.json();
        result = data.data;
    }catch(e){
        console.log(e);
    }
    console.log(result);
    return result;
}

function renderFontList(elment, fonts){
    fonts.map(item=>{
        const $li = document.createElement('li');
        $li.innerHTML = `
            <button data-font="${item.code}" style="font-family:${item.code};">
                ${item.name}
            </button>
        `;
        elment.append($li);
    });
}

export function renderFontOnFrame(font, fontType){
    console.log(font, fontType);
    const $target = document.querySelectorAll(`.card .${fontType}`);
    $target.forEach(item=>{
        item.style.fontFamily = font;
    });
}

function handlingFongBtn(){
    $fontBox.addEventListener('click', e =>{
        if(e.target.nodeName !== "BUTTON"){
            return;
        }
        const $fontList = e.target.closest('.font-list').querySelectorAll('li');
        $fontList.forEach(item=>{
            item.classList.remove('on');
        });
        e.target.closest('li').classList.add('on');
        
        const fontType = e.target.closest('.font-list').dataset.fonttype;
        const font = e.target.dataset.font;
        renderFontOnFrame(font, fontType);
        imgFrameData.fontData[fontType] = font;
        saveData(rule, imgFrameData);
    });
}

function setFontBox(fonts){
    renderFontList($fontBox_main, fonts);
    renderFontList($fontBox_sub, fonts);
    handlingFongBtn();
}

export default async function setFontDataForImgFrame(){
    console.log('얍!');
    const fontList = await loadFont();
    setFontBox(fontList);
}