import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

window.addEventListener('load', () => {
    function getParam() {
        // queryString 가져오기
        const params = new URLSearchParams(location.search);
        const rule = params.get('rule');
        const imageType = params.get('imageType');
        return {rule, imageType};
    }

    async function getData() {
        // 룰별 데이터 가져오기
        const response = await fetch('./data/rule-list.json');
        const data = await response.json();
        return data;
    }

    async function getImageMold(imageMoldLink) {
        // 이미지 틀 가져오기
        try {
            const response = await fetch(`./${imageMoldLink}.html`);
            if (response.status === 404) {
                return;
            }
            const data = await response.text();
            return data;
        } catch (e) {
            console.log(e);
        }
    }

    async function loadHTML() {
        // 파라미터에 맞는 HTML출력
        const {rule, imageType} = getParam();
        const ruleData = await getData();
        const moldData = await getImageMold(imageType) || `에러입니다.`;
        document
            .querySelector('.imageDom')
            .innerHTML = moldData;
    }

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
            relativeElement.innerText = `${value}`;
        });
    }

    function renderBackgoundImgOnFrame(imgURL){
        const cardImage = document.querySelector('.card-image');
        cardImage.style.backgroundImage = `url('${imgURL}')`;
    }

    function renderSearchResult(data) {
        if (!data) {
            return;
        }
        const imageList = data.results;
        const contentsImgbox = document.querySelector('.contents-imgbox');
        const $ul = document.createElement('ul');
        $ul.classList.add('result-list');

        if(imageList.length === 0){
            contentsImgbox.innerHTML=`검색결과가 없습니다.`;
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
        contentsImgbox.innerHTML='';
        contentsImgbox.append($ul);
    }

    async function getImage(keyword) {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Client-ID fZ4q8Zxb5oB1Dp2fP-t9T_d5T7yZt6tKKOfNmcUTHbE");
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'manual'
        };
        try {
            const response = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${keyword}`, requestOptions);
            const data = response.json();
            return data;
        } catch (e) {
            console.log('error', error);
            alert('error');
        }
    }

    async function searchImg() {
        const searchBox = document.querySelector('.search-box');
        const searchImg = document.querySelector('#searchImg');
        const contentsImgbox = document.querySelector('.contents-imgbox');

        searchBox.addEventListener('submit', async (e) => {
            e.preventDefault();
            const searchKeyword = searchImg.value;
            if(searchKeyword === ''){
                return;
            }
            searchImg.blur();
            contentsImgbox.innerHTML=`로딩중`;
            const imageList = await getImage(searchKeyword);
            console.log(imageList);
            renderSearchResult(imageList);
        });
        
    }

    function downloadTriggerForUnsplash(downloadLink){
        fetch(`${downloadLink}?client_id=fZ4q8Zxb5oB1Dp2fP-t9T_d5T7yZt6tKKOfNmcUTHbE`);
    }

    function HandlingSearchedImgList(){
        const contentsImgbox = document.querySelector('.contents-imgbox');
        contentsImgbox.addEventListener('click', e => {
            const target = e.target;
            if(target.nodeName !== "BUTTON"){
                return;
            }
            const target_li = target.closest('li');
            const imgURL = target_li.dataset.img;
            const downloadlink = target_li.dataset.downloadlink;
            renderBackgoundImgOnFrame(imgURL);
            // 언스플래시
            downloadTriggerForUnsplash(downloadlink);
        });
    }

    function setSearchedImg(){
        searchImg();
        HandlingSearchedImgList();
    }

    function setUploadedImg(){
        const uploadImgfile = document.querySelector('#uploadImgfile');
        uploadImgfile.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file.type.match(/image.*/)) {
                alert("이미지 파일만 올려주세요!💦");
                return;
            }
            const imgURL = URL.createObjectURL(file)
            renderBackgoundImgOnFrame(imgURL);
        }); 
    }

    function setImgDataForImgFrame() {
        setUploadedImg();
        setSearchedImg();
    }

    function handlingSaveBtn(){
        
        const btnSave = document.querySelector('.btn-save');

        btnSave.addEventListener('click', e => {
            const card = document.querySelector('.card');
            domtoimage.toPng(card).then(function (dataUrl){
                saveAs(dataUrl, "pretty image.png");
              }).catch(function (error) {
                return console.error(error);
              });
        })
    }

    async function init() {
        await loadHTML();
        setTextDataForImgFrame();
        setImgDataForImgFrame();
        handlingSaveBtn();
    }

    init();
});