// ==================== КОНСТАНТЫ И ПЕРЕМЕННЫЕ ====================

let mainContainer = document.querySelector('#main_container');
let btnBack = document.querySelectorAll('.back');
let navContainer = document.querySelector('#nav_container');
let startBookmarksBlock = document.querySelector('#start_bookmarks_block');
let content = document.querySelectorAll('.content');
let menuBlock = document.querySelectorAll('.menu_block');
let img = document.querySelectorAll('img');
let over = document.querySelector('.over');
let imgOver = document.querySelector('.imgOver');


let step = 1;
let obj = null;
let strPath;
let mainChildren = mainContainer.children;
let arrBOOKMARKS;
localStorage.getItem('bookmarks') != null ? arrBOOKMARKS = JSON.parse(localStorage.getItem('bookmarks')) : arrBOOKMARKS = [];


//Рендерит меню категорий
for (const category of content) {
  category.addEventListener('click', function () {

    if (category.dataset.category == 'JS') obj = objJS;
    else if (category.dataset.category == 'HTML') obj = objHTML;
    else if (category.dataset.category == 'CSS') obj = objCSS;
    else if (category.dataset.category == 'ONLINE') obj = objONLINE;

    renderCategory();
  })
}

function renderCategory() {
  if (step == 1) {
    step++;
    mainContainer.innerHTML = '';
    navContainer.classList.add('active');
    btnBack.forEach(elem => elem.classList.add('active'));

    for (const key in obj) {

      let folder = key.split('/');

      if (key != 'path') {
        let menuBox = createElems('div', mainContainer, folder[0], 'menu_block', key);

        menuBox.addEventListener('click', function (e) {

          step = 1;
          mainContainer.innerHTML = '';

          for (const elems of obj[this.getAttribute('data-category')]) {

            let res = elems.split(' ');

            mainContainer.insertAdjacentHTML('beforeEnd', `<div class="box" data-path="${obj.path}/${folder[1]}/${res[0]} ${res[1]}">
         <div class="head_munu">
            <span class="btn_head btn_add_save" title="добавить в избранное"></span>
            ${res[1].length > 8 ? `<a href="${res[1]}" target="_blank" title="переход по ссылке ${res[1]}" class="btn_head btn_go_site"></a>` : ``}
         </div>
            <div class="box_img">   
            <img src="${obj.path + '/' + folder[1] + '/' + res[0]}" alt="">
            </div>
         </div>`)

            document.querySelectorAll('.box').forEach(elems => elems.addEventListener('dragstart', e => e.preventDefault()))

            for (const element of mainChildren) {
              arrBOOKMARKS.filter(e => e == element.dataset.path ? element.children[0].children[0].classList.add('addBookmarks') : '');
            }
          }

          // mainContainer.addEventListener('click', HandlingTheButtonClick);

        })

      }
    }

  }

  else if (step == 2) {
    step = 1;
    mainContainer.innerHTML = '';
    navContainer.classList.remove('active');
    btnBack.forEach(elem => elem.classList.remove('active'));
  }

}

for (const elems of btnBack) elems.addEventListener('click', renderCategory);

// Блок закладок
startBookmarksBlock.addEventListener('click', function () {
  mainContainer.innerHTML = '';

  for (const elems of arrBOOKMARKS) {
    let res = elems.split(' ');
    let box = createElems('div', mainContainer, '', 'box');
    let img = createElems('img', box);
    img.src = res[0];
    img.draggable = false;

    if (res[1].length > 8) {
      let link = createElems('a', box, '', 'addLink');
      link.target = '_blank';
      link.title = `переход по ссылке ${res[1]}`;
      link.href = res[1];
      link.addEventListener('click', e => e.stopPropagation());
    }

    let del = createElems('div', box, '', 'delElems');
    del.title = 'удалить';

    del.addEventListener('click', function (e) {
      e.stopPropagation();
      del.closest('.box').remove();

      for (let i = 0; i < arrBOOKMARKS.length; i++) {
        if (arrBOOKMARKS[i].startsWith(res[0])) {
          arrBOOKMARKS.splice(i, 1);
          saveBookmarks(arrBOOKMARKS);
        }
      }

    })

  }

})

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
mainContainer.addEventListener('click', HandlingTheButtonClick);
//Делегирование событий для главного контейнера
function HandlingTheButtonClick(e) {
  // Обработка клика по кнопке добавления в закладки
  if (e.target.closest('span')) {

    strPath = e.target.closest('.box').dataset.path;

    if (!e.target.classList.contains('addBookmarks')) {
      arrBOOKMARKS.push(strPath);
      e.target.classList.add('addBookmarks');
    } else {
      arrBOOKMARKS = arrBOOKMARKS.filter(elem => elem != strPath);
      e.target.classList.remove('addBookmarks');
    }
    saveBookmarks(arrBOOKMARKS);
  }
  return;
}

// Создаёт DOM-элемент с параметрами
function createElems(tag, parent = null, text = '', className = '', dataAttr = null) {
  const elem = document.createElement(tag);
  if (text) elem.textContent = text;
  if (className) elem.className = className;
  if (dataAttr) elem.dataset.category = dataAttr;
  if (parent) parent.appendChild(elem);
  return elem;
}

// Безопасное сохранение закладок в localStorage
function saveBookmarks(arr) {
  try {
    localStorage.setItem('bookmarks', JSON.stringify(arr));
  } catch (e) {
    console.error('Ошибка сохранения в localStorage:', e);
  }
}

// Обработка клика по изображению для увеличения
mainContainer.addEventListener('click', e => e.target.closest('img') ? addOvelrlay(e.target.src) : null);

function scrollImg(elems, e) {
  e.preventDefault();
  let style = getComputedStyle(elems).width;
  e.deltaY > 0 && parseInt(style) > 300 ? elems.style.width = parseInt(style) - 25 + 'px' : elems.style.width = parseInt(style) + 25 + 'px';
}

// Оверлей 
function addOvelrlay(elem) {
  over.style.display = 'flex';
  imgOver.src = elem;
}

imgOver.addEventListener('wheel', e => scrollImg(imgOver, e));
imgOver.addEventListener('click', e => e.stopPropagation());
imgOver.addEventListener('pointerdown', drag);

over.addEventListener('click', () => {
  over.style.display = 'none';
  imgOver.style.position = '';
  imgOver.style.width = '';
});

// Drag & Drop
function drag(e) {
  e.target.setPointerCapture(e.pointerId);
  this.style.cursor = 'grabbing';
  this.style.position = 'absolute';

  let rect = this.getBoundingClientRect();
  let y = e.clientY - rect.top;
  let x = e.clientX - rect.left;

  let positionElem = e => {
    e.preventDefault();
    this.style.top = `${e.clientY - y}px`;
    this.style.left = `${e.clientX - x}px`;
  }

  this.addEventListener('pointermove', positionElem);
  this.addEventListener('pointerup', () => {
    this.removeEventListener('pointermove', positionElem);
    this.style.cursor = '';
  });
}
