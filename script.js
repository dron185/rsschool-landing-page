// burger:

const header = document.querySelector('.header');
const headerNav = document.querySelector('.header__nav-container');
const navItems = headerNav.querySelectorAll('a');
const burger = document.getElementById('burger');
const body = document.body;
const headerLogoLink = document.querySelector('.header__logo');

burger.addEventListener('click', () => {
  header.classList.toggle('active');
  body.classList.toggle('stop-scroll');
});

navItems.forEach(element => {
  element.addEventListener('click', () => {
    header.classList.remove('active');
    body.classList.remove('stop-scroll');
  });
});

headerLogoLink.addEventListener('click', () => {
  header.classList.remove('active');
  body.classList.remove('stop-scroll');
})

// Implementation of the carousel:

const carousel = document.querySelector('.favourites__carousel');
const slides = document.querySelector('.favourites__slides');
const images = slides.querySelectorAll('img');
const btnLeft = document.querySelector('.favourites__arrow-left');
const btnRight = document.querySelector('.favourites__arrow-right');
const indicators = document.querySelectorAll('.favourites__indicator');

const progress = document.querySelectorAll('.favourites__progress');

let carouselWidth;
let carouselCount = 0;

// делаем слайдер адаптивным:
window.addEventListener('resize', calculateWidth);
function calculateWidth() {
  carouselWidth = carousel.offsetWidth;
  slides.style.width = carouselWidth*images.length + 'px';
  images.forEach(element => {
    element.style.width = carouselWidth + 'px';
  });
  slideMovementDistamce();
}
calculateWidth();

// функции перелистывания слайдов вперед и назад:
function nextSlide() {
  carouselCount++;
  if (carouselCount >= images.length) {
    carouselCount = 0;
  }
  slideMovementDistamce();
  activeIndicator(carouselCount);
}

function prevSlide() {
  carouselCount--;
  if (carouselCount < 0) {
    carouselCount = images.length - 1;
  }
  slideMovementDistamce();
  activeIndicator(carouselCount);
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// расстояние перемещения слайдов:
function slideMovementDistamce() {
  slides.style.transform = `translateX(${-carouselCount * carouselWidth}px)`;
}

// выбирает индикатор соответствующий слайду:
function activeIndicator(index) {
  for (let indicator of progress) {
    indicator.classList.remove('progress-active');
    progress[index].classList.add('progress-active');
  }
}

let timer = setInterval(() => {
  nextSlide()
}, 5000);

slides.addEventListener('mouseover', () => {
  clearInterval(timer);
  const progressActive = document.querySelector('.progress-active');
  progressActive.style.animationPlayState = `paused`;
})

slides.addEventListener('mouseleave', () => {
  timer = setInterval(() => {
    nextSlide()
  }, 5000);
  const progressActive = document.querySelector('.progress-active');
  progressActive.style.animationPlayState = `running`;
})

// swiping left or right
carousel.addEventListener('touchstart', touchStart);
carousel.addEventListener('touchmove', touchMove);
let coordinateX;
let coordinateY;

function touchStart(event) {
  coordinateX = event.touches[0].clientX;
  coordinateY = event.touches[0].clientY;
}

function touchMove(event) {
  if (!coordinateX || !coordinateY) {
    return false;
  }
  let newCoordinateX = event.touches[0].clientX;
  let newCoordinateY = event.touches[0].clientY;
  let differCoordinateX = newCoordinateX - coordinateX;
  let differCoordinateY = newCoordinateY - coordinateY;

  if (Math.abs(differCoordinateX) > Math.abs(differCoordinateY)) {
    if (differCoordinateX > 0) {
      prevSlide()
    } else {
      nextSlide()
    }
  } 
  coordinateX = null;
  coordinateY = null;
}






