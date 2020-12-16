export function changeURL(rule, imgType){
    history.pushState(null, null, `mk-sessionCard.html?rule=${rule}&imageType=${imgType}`);
}

export default function init(rule, imgType){
    changeURL(rule, imgType);
}