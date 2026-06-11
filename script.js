document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.md\\:hidden button');
    const desktopNav = document.querySelector('nav');

    if (mobileMenuBtn && desktopNav) {
        mobileMenuBtn.addEventListener('click', () => {
            desktopNav.classList.toggle('hidden');
            desktopNav.classList.toggle('flex');
            desktopNav.classList.toggle('flex-col');
            desktopNav.classList.toggle('absolute');
            desktopNav.classList.toggle('top-20');
            desktopNav.classList.toggle('left-0');
            desktopNav.classList.toggle('w-full');
            desktopNav.classList.toggle('bg-white');
            desktopNav.classList.toggle('p-4');
            desktopNav.classList.toggle('shadow-md');
            desktopNav.classList.toggle('space-x-10');
            desktopNav.classList.toggle('space-y-4');
            desktopNav.classList.toggle('z-40');
        });
    }
});
