const themeToggle = document.querySelector('.header__theme-toggle');
// const logoIcon = document.querySelector('.logo-icon');

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    // if (document.body.classList.contains('dark')) {
    //     logoIcon.src = '../assets/svg/logo-dark.svg';
    // } else {
    //     logoIcon.src = '../assets/svg/logo.svg';
    // }

    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});
