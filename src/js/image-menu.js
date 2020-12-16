const $headBox = document.querySelector('#headBox h1');
const $imageList_list = document.querySelector(".image-list .list");

function getPageRule(){
    const searchString = window.location.search;
    const searchParams = new URLSearchParams(searchString);
    const rule = searchParams.get("rule");
    return rule;
}

async function getRuleList(){
    try{
        const response = await fetch('./data/rule-list.json');
        const data = await response.json();
        return data.data;
    }catch(e){
        console.log(e);
    }
}

function nowPageRule(data, queryString){
    const filterData = data.find(item => queryString === item["name-en"]);
    return filterData;
}

function drawPage(findData){
    if(!findData){
        console.log('404');
        return;
    }
    $headBox.innerHTML = `이미지 제작 - ${findData["name-ko"]}`;
    $imageList_list.innerHTML = ``;
    findData["image-list"].forEach(item => {
        const $article = document.createElement('article');
        $article.setAttribute('class', 'item');
        $article.innerHTML = `
                <a href="${item.link}">
                    ${item.name}
                </a>
        `;
        $imageList_list.append($article);
    });
}

async function init(){
    const data = await getRuleList();
    const queryString = getPageRule();
    const findData = nowPageRule(data, queryString);
    drawPage(findData);
}

init();