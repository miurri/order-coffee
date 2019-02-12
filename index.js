let uniqueNumber = 1; //уникальное число для индексации напитков
let addButton = document.querySelector('.add-button');
let count = 1;
let form = document.getElementsByTagName('form')[0];
let original = document.getElementsByTagName('fieldset')[0].cloneNode(true);

//функция удаления напитка
function delFieldset() {
    //кнопка должна работать в том случае, если напитков больше одного =>
    //удаление выбранного пользователем напитка
    if (count > 1) {
        let fieldset = this.parentNode;
        fieldset.parentNode.removeChild(fieldset);
        count--;
    }
}
document.querySelector('.del-button').addEventListener("click", delFieldset);

//функция добавления нового напитка
function addFieldset() {
    let orderFieldset = original.cloneNode(true);
    orderFieldset.querySelector('.beverage-count').textContent = `Напиток № ${++uniqueNumber}`;
    //создние радио-выборов, независящих друг от друга, назначением уникального имени
    orderFieldset.querySelectorAll('input[type=radio]').forEach(e => {
        e.setAttribute('name', `milk${uniqueNumber}`)
    });
    orderFieldset.querySelector('.del-button').addEventListener("click", delFieldset);
    orderFieldset.querySelector('textarea').addEventListener("change", changeWishes);
    form.insertBefore(orderFieldset, addButton.parentNode);
    count++;
}
addButton.addEventListener("click", addFieldset);

function changeWishes() {
    let fieldset = this.parentNode;
    let output = fieldset.querySelector('.wishes-text');
    let wordsArray = fieldset.querySelector('textarea').value.split(' ');
    let resultString = "";
    for (let i = 0; i < wordsArray.length; i++) {
        if (/срочно/.test(wordsArray[i]) || /быстрее/i.test(wordsArray[i]) || /скорее/i.test(wordsArray[i])) {
            resultString += `<b>${wordsArray[i]}</b>`;
        } else if (/очень нужно/i.test(`${wordsArray[i]} ${wordsArray[i + 1]}`) && i < wordsArray.length - 1) {
            resultString += `<b>${wordsArray[i]} ${wordsArray[i + 1]}</b>`;
            i++;
        } else {
            resultString += wordsArray[i];
        }
        if (i !== wordsArray.length - 1) {
            resultString += ' ';
        }
    }
    output.innerHTML = resultString;
}
document.querySelector('textarea').addEventListener("change", changeWishes);

let timeOrderDiv = document.querySelector('.order-time');
//функция создания текста в модальном окне о количестве напитков
function createText() {
    let orderText = document.createElement('p');
    orderText.className = 'orderText';
    let ending;
    if (count % 10 === 1) {
        ending = 'напиток'
    } else if (count % 10 > 1 && count % 10 < 5) {
        ending = 'напитка'
    } else {
        ending = 'напитков'
    }
    orderText.textContent = `Вы заказали ${count} ${ending}`;
    document.querySelector('.modal').insertBefore(orderText, timeOrderDiv);
}

//функция таблицы заказа
function createTable() {
    let tableOrder = document.createElement('table');
    tableOrder.className = 'tableOrder';
    let headerRow = tableOrder.createTHead().insertRow();
    for (let i= 0 ; i < 4; i++) {
        let cell = headerRow.insertCell();
        switch (i) {
            case 0:
                cell.textContent = 'Напиток';
                break;
            case 1:
                cell.textContent = 'Молоко';
                break;
            case 2:
                cell.textContent = 'Дополнительно';
                break;
            case 3:
                cell.textContent = 'Пожелания';
                break;
        }
    }
    let body = tableOrder.createTBody();
    for (let i = 0; i < count; i++) {
        let row = body.insertRow();
        for (let j = 0; j < 4; j++) {
            let cell = row.insertCell();
            let fieldset = document.getElementsByTagName('fieldset')[i];
            switch (j) {
                case 0:
                    cell.textContent = fieldset.querySelector('option:checked').textContent;
                    break;
                case 1:
                    cell.textContent = fieldset.querySelector('input[type=radio]:checked').value;
                    break;
                case 2:
                    let addsString = '';
                    let adds = fieldset.querySelectorAll('input[type=checkbox]:checked');
                    for (let s = 0; s < adds.length; s++) {
                        addsString += adds[s].value;
                        if (s !== adds.length - 1) {
                            addsString += ', ';
                        }
                    }
                    cell.textContent = addsString;
                    break;
                case 3:
                    if (fieldset.querySelector('.wishes-text').textContent === 'Напишите ваши пожелания') {
                        cell.textContent = "";
                    } else {
                        cell.innerHTML = fieldset.querySelector('.wishes-text').innerHTML;
                    }
                }
            }
        }
    document.querySelector('.modal').insertBefore(tableOrder, timeOrderDiv);
}

//обраотчик кнопки открытия модального окна
function openModal() {
    document.querySelector('.overlay').style.opacity = '1';
    document.querySelector('.overlay').style.pointerEvents = 'auto';
    createText();
    createTable();
}
document.querySelector('.submit-button').addEventListener("click", openModal);

//обработчик кнопки принятия заказа
function submitOrder() {
    let timeInput = document.querySelector('input[type=time]').value.split(':');
    if (parseInt(timeInput[0],10) < new Date().getHours()
        || (parseInt(timeInput[0],10) === new Date().getHours() && parseInt(timeInput[1],10) < new Date().getMinutes())) {
        alert('Мы не умеем перемещаться во времени. Выберите время позже, чем текущее');
        document.querySelector('input[type=time').style.borderColor = "red";
    } else {
        closeModal();
    }
}
document.querySelector('.order-submit').addEventListener("click", submitOrder);

//обработчик кнопки закрытия модального окна
function closeModal() {
    document.querySelector('.modal').removeChild(document.querySelector('.orderText'));
    document.querySelector('.modal').removeChild(document.querySelector('.tableOrder'));
    document.querySelector('.overlay').style.opacity = '0';
    document.querySelector('.overlay').style.pointerEvents = 'none';
}
document.querySelector('.close-modal-button').addEventListener("click", closeModal);