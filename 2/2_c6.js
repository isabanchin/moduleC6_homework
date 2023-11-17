const btnNode = document.querySelector('.btn');
btnNode.addEventListener('click', () => {
    alert(`Размеры Вашего экрана (ширина x высота): ${window.screen.width} x ${window.screen.height} pxls`)
});