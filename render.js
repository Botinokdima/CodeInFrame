// ==================== КОНСТАНТЫ И ПЕРЕМЕННЫЕ ====================

let mainContainer = document.querySelector('#main_container');
let btnBack = document.querySelectorAll('.back');
let navContainer = document.querySelector('#nav_container');
let startBookmarksBlock = document.querySelector('#start_bookmarks_block');
let content = document.querySelectorAll('.content');
let menuBlock = document.querySelectorAll('.menu_block')


let step = 1;
let obj = null;
let strPath;
let mainChildren = mainContainer.children;
let arrBOOKMARKS
let translateTransform = false
localStorage.getItem('bookmarks') != null ? arrBOOKMARKS = JSON.parse(localStorage.getItem('bookmarks')) : arrBOOKMARKS = [];




/**
 * Рендерит меню категорий
 */
for (const category of content) {

  category.addEventListener('click', function () {

    if (category.dataset.category == 'JS') {
      obj = objJS
    }
    else if (category.dataset.category == 'HTML') {
      obj = objHTML
    }
    else if (category.dataset.category == 'CSS') {
      obj = objCSS
    }

    renderCategory()

  })

}


function renderCategory() {
  if (step == 1) {
    step++
    mainContainer.innerHTML = ''
    navContainer.classList.add('active')
    btnBack.forEach(elem => { elem.classList.add('active') })

    for (const key in obj) {

      let folder = key.split('/')

      if (key != 'path') {
        let menuBox = createElems('div', mainContainer, folder[0], 'menu_block', key);

        menuBox.addEventListener('click', function () {
          step = 1
          mainContainer.innerHTML = ''

          for (const elems of obj[this.getAttribute('data-category')]) {

            let res = elems.split(' ')

            mainContainer.insertAdjacentHTML('beforeEnd', `<div class="box">
         <div class="head_munu">
            <span class="btn_head btn_add_save" title="добавить в избранное"></span>
            <a href="${res[1]}" target="_blank" title="переход по ссылке" class="btn_head btn_go_site"></a>
         </div>
            <div class="box_img">   
            <img src="${obj.path + '/' + folder[1] + '/' + res[0]}" alt="">
            </div>
         </div>`)



            // var iso = new Isotope(mainContainer, {
            //     // options
            //     itemSelector: '.box',
            //     fitWidth: true
            //    // layoutMode: 'fitRows'
            //   });



            console.log(document.querySelectorAll('.box'));
            document.querySelectorAll('.box').forEach(elems => elems.addEventListener('dragstart', e => e.preventDefault()))

            for (let i = 0; i < mainChildren.length; i++) {

              strPath = obj.path + '/' + folder[1] + '/' + obj[this.getAttribute('data-category')][i]

              for (let j = 0; j < arrBOOKMARKS.length; j++) {

                if (arrBOOKMARKS[j].startsWith(strPath)) {
                  mainChildren[i].children[0].children[0].classList.add('addBookmarks');
                }

              }
            }
          }


          for (let i = 0; i < mainChildren.length; i++) {

            mainChildren[i].addEventListener('click', e => {

              if (e.target.tagName == 'SPAN') {
                strPath = obj.path + '/' + folder[1] + '/' + obj[this.getAttribute('data-category')][i]


                if (!e.target.classList.contains('addBookmarks')) {
                  arrBOOKMARKS.push(strPath)
                  saveBookmarks(arrBOOKMARKS)
                  e.target.classList.add('addBookmarks')

                } else {
                  e.target.classList.remove('addBookmarks')

                  for (let j = 0; j < arrBOOKMARKS.length; j++) {

                    if (arrBOOKMARKS[j].startsWith(strPath)) {
                      arrBOOKMARKS.splice(j, 1);
                      saveBookmarks(arrBOOKMARKS)
                    }

                  }
                }
              }

              if (e.target.tagName == 'IMG') {

                let over = createElems('div', document.body, '', 'over')

                over.addEventListener('click', () => over.remove())

                let imgOver = createElems('img', over, '', 'imgOver')
                imgOver.src = e.target.src
                imgOver.loading = 'lazy'

                imgOver.addEventListener('wheel', e => scrollImg(imgOver, e))
                imgOver.addEventListener('click', e => e.stopPropagation())
                imgOver.addEventListener('dragstart', e => e.preventDefault())
                imgOver.addEventListener('mousedown', e => positionImg(imgOver))

              }

            })
          }
        })

      }
    }

  }

  else if (step == 2) {
    step = 1
    mainContainer.innerHTML = ''
    navContainer.classList.remove('active')
    btnBack.forEach(elem => { elem.classList.remove('active') })
  }

}

for (const elems of btnBack) elems.addEventListener('click', renderCategory)

// -----------------------

startBookmarksBlock.addEventListener('click', function () {

  mainContainer.innerHTML = ''

  for (const elems of arrBOOKMARKS) {

    let res = elems.split(' ')
    let box = createElems('div', mainContainer, '', 'box')
    let img = createElems('img', box)
    img.src = res[0]

    box.addEventListener('click', function (e) {

      let over = createElems('div', document.body, '', 'over')

      over.addEventListener('click', () => over.remove())

      let imgOver = createElems('img', over, '', 'imgOver')
      imgOver.src = e.target.src
      imgOver.loading = 'lazy'

      imgOver.addEventListener('wheel', e => scrollImg(imgOver, e))
      imgOver.addEventListener('click', e => e.stopPropagation())
      imgOver.addEventListener('dragstart', e => e.preventDefault())
      imgOver.addEventListener('mousedown', e => positionImg(imgOver))
    })

    box.addEventListener('mouseenter', function (e) {

      e.stopPropagation()
      let link = createElems('a', box, '', 'addLink')
      link.target = '_blank';
      link.title = 'переход по ссылке';
      link.href = res[1]

      let del = createElems('div', box, '', 'delElems')
      del.title = 'удалить'
      link.addEventListener('click', e => e.stopPropagation())

      del.addEventListener('click', function (e) {
        e.stopPropagation()

        del.closest('.box').remove()

        for (let i = 0; i < arrBOOKMARKS.length; i++) {

          if (arrBOOKMARKS[i].startsWith(res[0])) {
            arrBOOKMARKS.splice(i, 1);
            saveBookmarks(arrBOOKMARKS)
          }

        }
      })

      box.addEventListener('mouseleave', function (e) {
        link.remove()
        del.remove()
      })

    })

  }

})


// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
/**
 * 
 * Создаёт DOM-элемент с параметрами
 */
function createElems(tag, parent = null, text = '', className = '', dataAttr = null) {
  const elem = document.createElement(tag);
  if (text) elem.textContent = text;
  if (className) elem.className = className;
  if (dataAttr) elem.dataset.category = dataAttr;
  if (parent) parent.appendChild(elem);
  return elem;
}

/**
 * Безопасное сохранение закладок в localStorage
 */
function saveBookmarks(arr) {
  try {
    localStorage.setItem('bookmarks', JSON.stringify(arr));
  } catch (e) {
    console.error('Ошибка сохранения в localStorage:', e);
  }
}


function scrollImg(elems, e) {
  e.preventDefault();
  let style = getComputedStyle(elems).width;
  e.deltaY > 0 ? elems.style.width = parseInt(style) - 20 + 'px' : elems.style.width = parseInt(style) + 20 + 'px'
}


function positionImg(elems) {
  translateTransform = true
  elems.style.cursor = 'grabbing'
  elems.addEventListener('mouseup', function (e) {
    translateTransform = false
    elems.style.transform = '';
    elems.style.cursor = '';
  })

  elems.addEventListener('mousemove', function func(e) {
    translateTransform ? elems.style.transform = `translateY(${e.clientY - document.documentElement.clientHeight / 2}px)` : null
  })
}
