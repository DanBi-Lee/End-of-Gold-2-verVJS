export function loadData(rule){
    let data = localStorage.getItem(rule);
    if(!data){
        data = {
            textData : {
                'main-text' : '',
                'sub-text1' : '',
                'sub-text2' : '',
                'sub-text3' : '',
                'scenario-type' : ''
            },
            imgData : {
                'background-img' : '',
                'downloadlink' : ''
            }
        };
    }else{
        data = JSON.parse(data);
    }
    return data;
}

export function saveData(rule, data){
    const jsonData = JSON.stringify(data);
    localStorage.setItem(rule, jsonData);
    console.log(data);
}