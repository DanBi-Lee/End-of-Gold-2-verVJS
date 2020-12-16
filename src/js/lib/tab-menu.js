function tab(target, buttonLi, boxLi, boxClassname){
    if(target.nodeName !== "BUTTON"){
        return;
    }

    const _targetLi = target.closest('li');
    const _dataType = _targetLi.dataset.type;
    const _box = document.querySelector(`.${boxClassname} .${_dataType}-box`);
    buttonLi.forEach(item => item.classList.remove('on'));
    _targetLi.classList.add('on');
    boxLi.forEach(item => item.classList.remove('on'));
    _box.closest('li').classList.add('on');
}

export default tab;