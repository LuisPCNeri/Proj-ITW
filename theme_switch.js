        // Função para alternar o tema
        const themeSwitcher = document.getElementById('themeSwitcher');
        const body = document.body;

        // Aplica o tema armazenado no localStorage ao carregar a página
        window.addEventListener('DOMContentLoaded', () => {
            const storedTheme = localStorage.getItem('theme') || 'light'; // Padrão: 'light'
            if (storedTheme === 'dark') {
                body.classList.add('dark-theme');
                themeSwitcher.checked = true; // Atualiza o estado do checkbox
            } else {
                body.classList.add('light-theme');
            }
        });

        // Alterna o tema e armazena a preferência no localStorage
        themeSwitcher.addEventListener('change', () => {
            if (themeSwitcher.checked) {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark'); // Armazena o tema
            } else {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light'); // Armazena o tema
            }
        });  