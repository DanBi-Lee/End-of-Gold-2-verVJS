import {loadData, saveData} from '../partials/dataManagementForImageFrame';
import {rule} from '../partials/loadHTML';

const imgFrameData = loadData(rule);
const $searchPlatform = document.querySelector('#searchPlatform');
const $contentsImgbox = document.querySelector('.contents-imgbox');

export function renderBackgoundImgOnFrame(imgURL){
    const cardImage = document.querySelector('.card-image');
    cardImage.style.backgroundImage = `url('${imgURL}')`;
}

function setUploadedImg(){
    const uploadImgfile = document.querySelector('#uploadImgfile');
    uploadImgfile.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file.type.match(/image.*/)) {
            alert("이미지 파일만 올려주세요!💦");
            return;
        }
        const reader = new FileReader();
        console.log('test');
        reader.addEventListener("load", () => {
            const imgURL = reader.result;
            console.log(imgURL);
            imgFrameData.imgData['background-img'] = imgURL;
            imgFrameData.imgData.downloadlink = '';
            saveData(rule, imgFrameData);
            renderBackgoundImgOnFrame(imgURL);
        });
        reader.readAsDataURL(file);
    }); 
}

function renderSearchResultByUnsplash(data) {
    if (!data) {
        return;
    }
    const imageList = data.results;
    const $ul = document.createElement('ul');
    $ul.classList.add('result-list');

    if(imageList.length === 0){
        $contentsImgbox.innerHTML=`검색결과가 없습니다.`;
        return;
    }

    imageList.forEach(item => {
        const $li = document.createElement('li');
        $li.dataset.img = item.urls.regular;
        $li.dataset.downloadlink = item.links.download_location;
        $li.innerHTML = `             
                <button class="wrap_img" style="background-image: url('${item.urls.thumb}')">
                    <a href="${item.links.html}" target="_blank">
                        원본 ☞ ${item.user.first_name||''} ${item.user.last_name||''}
                    </a>                  
                </button>
        `;
        $ul.append($li);
    });
    $contentsImgbox.innerHTML='';
    $contentsImgbox.append($ul);
}

function renderSearchResultByPixabay(data) {
    console.log(data);
    if (!data) {
        return;
    }
    const imageList = data.hits;
    const $ul = document.createElement('ul');
    $ul.classList.add('result-list');

    if(imageList.length === 0){
        $contentsImgbox.innerHTML=`검색결과가 없습니다.`;
        return;
    }

    imageList.forEach(item => {
        const $li = document.createElement('li');
        $li.dataset.img = item.largeImageURL;
        $li.dataset.downloadlink = '';
        $li.innerHTML = `             
                <button class="wrap_img" style="background-image: url('${item.previewURL}')">
                    <a href="${item.pageURL}" target="_blank">
                        원본 ☞ ${item.user||''}
                    </a>                  
                </button>
        `;
        $ul.append($li);
    });
    $contentsImgbox.innerHTML='';
    $contentsImgbox.append($ul);
}

async function getImageByUnsplash(keyword) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Client-ID fZ4q8Zxb5oB1Dp2fP-t9T_d5T7yZt6tKKOfNmcUTHbE");
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'manual'
    };
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?page=1&per_page=60&query=${keyword.replace(' ','_')}`, requestOptions);
        const data = response.json();
        return data;
    } catch (e) {
        console.log('error', error);
        alert('error');
    }
}

async function serchImgByUnsplash(searchKeyword){
    const imageList = await getImageByUnsplash(searchKeyword);
    renderSearchResultByUnsplash(imageList);
}

async function getImageByPixabay(searchKeyword){
    try{
        const response = await fetch(`https://pixabay.com/api/?key=17163984-867a8b6f54b9fd842905aca26&q=${searchKeyword.replace(' ','_')}&per_page=60&page=1`);
        const data = response.json();
        return data;
    } catch(e) {
        console.log(e);
    }
}

async function serchImgByPixabay(searchKeyword){
    const imageList = await getImageByPixabay(searchKeyword);
    renderSearchResultByPixabay(imageList);
}

function searchImg() {
    const searchBox = document.querySelector('.search-box');
    const searchImg = document.querySelector('#searchImg');

    searchBox.addEventListener('submit', (e) => {
        const platform = $searchPlatform.value;

        e.preventDefault();
        const searchKeyword = searchImg.value;
        if(searchKeyword === ''){
            return;
        }
        searchImg.blur();
        $contentsImgbox.innerHTML=`로딩중`;
        
        switch (platform){
            case 'unsplash' :
                serchImgByUnsplash(searchKeyword);
                break;
            case 'pixabay' :
                serchImgByPixabay(searchKeyword);
                break;
            default :
                throw '확인되지 않은 플랫폼';
        }
    });
    
}

function HandlingSearchedImgList(imgFrameData){
    $contentsImgbox.addEventListener('click', e => {
        const target = e.target;
        if(target.nodeName !== "BUTTON"){
            return;
        }
        const target_li = target.closest('li');
        const imgURL = target_li.dataset.img;
        const downloadlink = target_li.dataset.downloadlink;
        renderBackgoundImgOnFrame(imgURL);
        // 데이터에 저장
        console.log(imgFrameData);
        imgFrameData.imgData['background-img'] = imgURL;
        imgFrameData.imgData.downloadlink = downloadlink;
        saveData(rule, imgFrameData);
    });
}

function setSearchedImg(imgFrameData){
    searchImg();
    HandlingSearchedImgList(imgFrameData);
}

export function handlingSearchPlatformSelect(){
    $searchPlatform.addEventListener('change', e => {
        const target = e.target;
        const value = target.value;

        $contentsImgbox.innerHTML = `
            <p>
                이미지를 검색하거나 <br>
                직접 이미지 파일을 업로드할 수 있습니다. <br>
                <a href="https://${value}.com/" target="_blank">Photo by ${value}</a>
            </p>
        `;
    })
}

export default function setImgDataForImgFrame(imgFrameData) {
    setUploadedImg();
    setSearchedImg(imgFrameData);
}