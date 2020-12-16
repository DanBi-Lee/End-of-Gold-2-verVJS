import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import loadHTML, {rule} from './partials/loadHTML';
import {loadData, saveData} from './partials/dataManagementForImageFrame';
import pageTransform from './lib/pageTransform';
import setImgDataForImgFrame, {handlingSearchPlatformSelect} from './lib/setImgDataFormImgFrame';
import setFontDataForImgFrame, {renderFontOnFrame} from './lib/setFontDataFormImgFrame';
import setDecoDataForImgFrame from './lib/setDecoDataFormImgFrame';

const imgFrameData = loadData(rule);

window.addEventListener('load', () => {
    function setTextDataForImgFrame() {
        // 텍스트 데이터 세팅
        const $textBox = document.querySelector('.text-box');

        $textBox.addEventListener('keyup', e => {
            const target = e.target;
            if (target.type !== "text") {
                return;
            }
            const value = target.value;
            const textType = target.dataset.texttype;
            const relativeElement = document.querySelector(`.${textType} span`);
            if(!relativeElement){
                return;
            }
            relativeElement.innerText = `${value}`;
            imgFrameData.textData[textType] = value;
            saveData(rule, imgFrameData);
        });

        $textBox.addEventListener('input', e=>{
            const target = e.target;
            if (target.type !== "range") {
                return;
            }
            const value = target.value;
            const textType = target.dataset.texttype;
            const relativeElement = document.querySelector(`.${textType} span`);
            const $numberInput = target.parentElement.querySelector('input[type="number"]');
            if(!relativeElement){
                return;
            }
            $numberInput.value = `${value}`;
            relativeElement.innerText = `${value}`;
            imgFrameData.textData[textType] = value;
            saveData(rule, imgFrameData);
        })
    }

    function downloadTriggerForUnsplash(downloadLink){
        fetch(`${downloadLink}?client_id=fZ4q8Zxb5oB1Dp2fP-t9T_d5T7yZt6tKKOfNmcUTHbE`);
    }

    function handlingSaveBtn(){
        const btnSave = document.querySelector('.btn-save');

        btnSave.addEventListener('click', e => {
            const card = document.querySelector('.card');
            domtoimage.toPng(card).then(function (dataUrl){
                saveAs(dataUrl, "세션카드.png");
                // 언스플래시 다운로드 트리거
                downloadTriggerForUnsplash(imgFrameData.imgData.downloadlink);
              }).catch(function (error) {
                return console.error(error);
              });
        })
    }

    function setDataOnFrame(data){
        // textData
        for(let key in data.textData){
            const $element = document.querySelector(`.${key} span`);
            if(!$element){
                continue;
            }
            $element.innerText = data.textData[key];
        }

        // imgData
        const backgroundImg = data.imgData['background-img'];
        const $cardImage = document.querySelector('.card-image');
        if(!$cardImage){
            return;
        }
        $cardImage.style.backgroundImage = `url('${backgroundImg}')`;

        // fontData
        for(let key in data.fontData){
            renderFontOnFrame(data.fontData[key] ,key);
        }

        // decoData
        for(let key in data.decoData){
            console.log(data.decoData[key], key);
            for(let prop in data.decoData[key]){
                document.querySelector(`.${key}`).style[prop] = data.decoData[key][prop];
            }
        }
    }

    function handlingSelectOfImgType(){
        const $selectImageType = document.querySelector('#selectImageType');
        $selectImageType.addEventListener('change', async e=>{
            console.log(e.target.value);
            const value = e.target.value;
            pageTransform(rule, value);
            await loadHTML();
            setDataOnFrame(imgFrameData);
        })
    }

    async function init() {
        await loadHTML();
        setDataOnFrame(imgFrameData);
        setTextDataForImgFrame();
        setImgDataForImgFrame(imgFrameData);
        setFontDataForImgFrame();
        setDecoDataForImgFrame();
        handlingSaveBtn();
        handlingSelectOfImgType();
        handlingSearchPlatformSelect();
    }

    init();
});