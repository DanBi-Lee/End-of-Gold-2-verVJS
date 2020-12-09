export async function getImageMold(imageMoldLink) {
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

export async function getData() {
    // 룰별 데이터 가져오기
    const response = await fetch('./data/rule-list.json');
    const data = await response.json();
    return data;
}

export function getParam() {
    // queryString 가져오기
    const params = new URLSearchParams(location.search);
    const rule = params.get('rule');
    const imageType = params.get('imageType');
    return {rule, imageType};
}

export default async function loadHTML() {
    // 파라미터에 맞는 HTML출력
    const {rule, imageType} = getParam();
    const ruleData = await getData();
    const moldData = await getImageMold(imageType) || `에러입니다.`;
    document
        .querySelector('.imageDom')
        .innerHTML = moldData;
}