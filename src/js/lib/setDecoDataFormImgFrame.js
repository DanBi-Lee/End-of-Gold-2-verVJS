import {loadData, saveData} from '../partials/dataManagementForImageFrame';
import {rule} from '../partials/loadHTML';
import {throttle} from './performance-improvement';

const imgFrameData = loadData(rule);
const $decorationBox = document.querySelector('.decoration-box');
const $decorationBox_form = document.querySelector('.decoration-box form');
let dataValue;

$decorationBox_form.addEventListener('reset', e =>{
    imgFrameData.decoData = {
        'card-image' : {
            filter : '',
        },
        'bg-color' : {
            'background-color': '#000000',
            opacity: 0.8
        },
        'blend-layer' : {
            'mix-blend-mode': '',
            'background-color': '#000000',
            opacity: 0
        }
    }
    saveData(rule, imgFrameData);

    for(let key in imgFrameData.decoData){
        console.log(imgFrameData.decoData[key], key);
        for(let prop in imgFrameData.decoData[key]){
            document.querySelector(`.${key}`).style[prop] = imgFrameData.decoData[key][prop];
        }
    }
});

export function renderDecoOnFrame({layername, prop, value, propvalue='', unit=''}){
    switch(prop){
        case 'opacity' :
            dataValue = value;
            document.querySelector(`.${layername}`).style.opacity = dataValue;
            break;
        case 'background-color' :
            dataValue = value;
            document.querySelector(`.${layername}`).style.backgroundColor = dataValue;
            break;
        case 'mix-blend-mode':
            dataValue = value;
            document.querySelector(`.${layername}`).style['mix-blend-mode'] = dataValue;
            break;
        case 'filter':
            const $layer = document.querySelector(`.${layername}`);
            const existingVlaue = $layer.style['filter'] || '';
            const filterValue = existingVlaue.split(' ');
            const hasValue = filterValue.indexOf(filterValue.find(item=> item.includes(propvalue)));
            console.log('hasValue' +hasValue);
            if( hasValue === -1){
                dataValue =  existingVlaue + ` ${propvalue}(${value}${unit})`;
                $layer.style['filter'] = dataValue;
            }else{
                filterValue[hasValue] = `${propvalue}(${value}${unit})`;
                dataValue = filterValue.join(' ');
                $layer.style['filter'] = dataValue;
                console.log(dataValue);
            }
            break;
        default :
            throw new Event('지정되지 않은 속성');
    }
}

function handlingDecoInput(){
    $decorationBox.addEventListener('input', e => {
        const target = e.target;
        if(target.nodeName !== "INPUT" && target.nodeName !== "SELECT"){
            return;
        }
        function reflectDeco(){
            renderDecoOnFrame({
                layername : target.dataset.layername , 
                prop : target.dataset.prop, 
                value : target.value, 
                propvalue : target.dataset.propvalue, 
                unit : target.dataset.unit
            });
            imgFrameData.decoData[target.dataset.layername][target.dataset.prop] = dataValue;
            saveData(rule, imgFrameData);
        }
        throttle(reflectDeco);
    });
}

export default function setDecoDataForImgFrame(){
    handlingDecoInput();
}