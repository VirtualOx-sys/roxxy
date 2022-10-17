window.onload = () => {
    const cmdsBoxInner = document.querySelector('.cmdsBoxInner'),
        newTab = document.querySelector('.newTab'),
        cmdFilters = document.querySelector('.cmdsBoxCmdsContainer .cmdFilters');
    if (window.location.search.includes('min=true')) document.body.classList.remove('zoomed'); // ?min=true for minimized mode
    if (window.self === window.top) cmdsBoxInner.querySelector('header').style.display = 'block';
    else {
        newTab.style.display = 'block';
        if (window.top.location.origin === window.self.location.origin) window.top.document.querySelector('.loader').style.display = 'none';
    }
    if (window.location.hash) {
        let id = window.location.hash;
        if (document.querySelector(id)) {
            if (document.querySelector(`.cmdFilter.${id.slice(1)}Selector`)) {
                cmdFilters.querySelector('.cmdFilter.active').classList.remove('active')
                document.querySelector(`.cmdFilter.${id.slice(1)}Selector`).classList.add('active');
            }
        }
        cmdFilters.style.transform = cmdsBoxInner.scrollTop > 100 && `translateY(${cmdsBoxInner.scrollTop - 55}px)` || cmdsBoxInner.scrollTop <= 2980 && 'translateY(55px)';
    }
    const ifrNum = window.self !== window.top && 110 || 0;

    cmdsBoxInner.addEventListener('scroll', () => cmdFilters.style.transform = cmdsBoxInner.scrollTop > 100 && `translateY(${(cmdsBoxInner.scrollTop - 55) + ifrNum}px)` || cmdsBoxInner.scrollTop <= 2980 && 'translateY(55px)'); 

    cmdFilters.querySelectorAll('.cmdFilter').forEach(e =>
        e.addEventListener('click', el => {
            let a = el.target.querySelector('a[href]');
            if (a) window.location = a.href;
            cmdFilters.querySelector('.cmdFilter.active').classList.remove('active')
            el.target.closest('.cmdFilter').classList.add('active')
        })
    );



    cmdsBoxInner.addEventListener('click', () => {
        let win = document.querySelector('.win2'), cls = document.body.classList;
        if (cls.contains('shoWin2')) {
            cmdsBoxInner.style.removeProperty('left');
            cls.remove('shoWin2');
            win.classList.add('aside');
            return false;
        }
    });

    document.querySelectorAll('.cmds .cmd:not(.ccmd)').forEach(elem => {
        elem.addEventListener('click', clicked => {
            if (window.getSelection().toString().length === 0 && clicked.target.classList.contains('cmd')) {
                clicked.target.querySelector('.cmdData').classList.toggle('active');
            };
        });
    });

    let lst = [
        "Para los comandos que requieren un usuario, puede decir el ID o el nombre del usuario (entre comillas si tiene espacios) en lugar de hacer ping al usuario.",
        "Puede usar el comando de comentarios para enviar comentarios al desarrollador del bot. También puede cargar capturas de pantalla junto con el comando si es necesario"
    ]


    document.querySelectorAll('.emojiImage')
        .forEach(e => e.src = `https://cdn.discordapp.com/emojis/${e.classList[1]}.png`)

    window.matchMedia('(max-width: 1215px)').addEventListener('change', (e) => {
        if (e.matches) {
            cls = document.body.classList, win = document.querySelector('.win2'), inner = win.querySelector('.inner');
            win.style.display = 'unset', inner.style.right = '-100px';
            setTimeout(() => {
                inner.style.removeProperty('right');
                win.style.removeProperty('display');
            }, 1000);
            if (cls.contains('shoWin2')) {
                cls.remove('shoWin2');
                win.classList.add('aside');
            }
        }
    });
};