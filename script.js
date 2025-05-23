
function sair() {
    localStorage.setItem('isLoggedIn', 'false'); // ou localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html'; // página de login
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro');
    const mensagem = document.getElementById('mensagem');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const cepInput = document.getElementById('cep');
    const enderecoInput = document.getElementById('endereco');
    const bairroInput = document.getElementById('bairro');

    // Quando sair do campo CEP, buscar endereço
    cepInput.addEventListener('blur', buscarEnderecoPorCEP);

    function validarCampo(campo, erroId, condicao, mensagemErro = '') {
        const erro = document.getElementById(erroId);
        if (condicao) {
            erro.textContent = '';
            campo.classList.remove('invalid');
            return true;
        } else {
            erro.textContent = mensagemErro;
            campo.classList.add('invalid');
            return false;
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const cep = cepInput.value.trim();
        const endereco = enderecoInput.value.trim();
        const bairro = bairroInput.value.trim();

        const nomeValido = validarCampo(nomeInput, 'erroNome', nome !== '', 'Digite seu nome.');
        const emailValido = validarCampo(emailInput, 'erroEmail', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Email inválido.');
        const cepValido = validarCampo(cepInput, 'erroCep', /^[0-9]{5}-?[0-9]{3}$/.test(cep), 'CEP inválido.');

        if (!nomeValido || !emailValido || !cepValido) {
            mensagem.textContent = '';
            return;
        }

        const voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];

        if (voluntarios.some(v => v.email === email)) {
            mensagem.textContent = 'Este email já está cadastrado.';
            mensagem.style.color = 'red';
            return;
        }

        const novoVoluntario = { nome, email, cep, endereco, bairro };
        voluntarios.push(novoVoluntario);
        localStorage.setItem('voluntarios', JSON.stringify(voluntarios));

        mensagem.textContent = 'Cadastro realizado com sucesso!';
        mensagem.style.color = 'green';
        form.reset();

        nomeInput.classList.remove('invalid');
        emailInput.classList.remove('invalid');
        cepInput.classList.remove('invalid');
    });
});

function buscarEnderecoPorCEP() {
    
    let cep = document.getElementById("cep").value;
    cep = cep.replace(/\D/g, "");

    if (cep.length !== 8) {
        alert("CEP inválido. Deve conter 8 números.");
        document.getElementById("endereco").value = "";
        document.getElementById("bairro").value = "";
        return;
    }

    const url = `https://viacep.com.br/ws/${cep}/json/`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert("CEP não encontrado.");
                document.getElementById("endereco").value = "";
                document.getElementById("bairro").value = "";
            } else {
                document.getElementById("endereco").value = data.logradouro || "";
                document.getElementById("bairro").value = data.bairro || "";
                document.getElementById("cidade").value = data.localidade || "";
                
                
            }
        })
        .catch(error => {
            console.error("Erro ao buscar o CEP:", error);
            alert("Erro ao buscar o CEP.");
        });
}


document.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('listaVoluntarios');
    const filtroInput = document.getElementById('filtro');
    const btnLimpar = document.getElementById('limparTudo');

    let voluntarios = JSON.parse(localStorage.getItem('voluntarios')) || [];

    async function buscarImagem(nome) {
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(nome)}&client_id=IioNOGyPqGJTxHB0QOVzL-i96CVbNnppPfRvwNXgHHE`;

        try {
            const resposta = await fetch(url);
            const dados = await resposta.json();

            if (dados.results && dados.results.length > 0) {
                return dados.results[0].urls.small;
            } else {
                return 'img/padrao.jpg'; // Caminho local para imagem padrão
                
            }
        } catch (erro) {
            console.error('Erro ao buscar imagem:', erro);
            return 'img/padrao.jpg';
        }
    }

    async function renderizarVoluntarios(filtro = '') {
        lista.innerHTML = '';

        const filtrados = voluntarios.filter(v =>
            v.nome.toLowerCase().includes(filtro.toLowerCase())
        );

        if (filtrados.length === 0) {
            lista.innerHTML = '<p>Nenhum voluntário encontrado.</p>';
            return;
        }

        for (const [index, voluntario] of filtrados.entries()) {
            const card = document.createElement('div');
            card.className = 'card';

            const imagemUrl = await buscarImagem(voluntario.nome);
            const temperatura = await buscarTemperatura(voluntario.cidade);

            card.innerHTML = `
                <img src="${imagemUrl}" alt="Foto de ${voluntario.nome}">
                <h3>${voluntario.nome}</h3>
                <p><strong>Email:</strong> ${voluntario.email}</p>
                <p><strong>Endereço:</strong> ${voluntario.endereco}, ${voluntario.bairro} - CEP: ${voluntario.cep}</p>
                <p><strong>Temperatura atual em ${voluntario.cidade}:</strong> ${temperatura}</p>
                <button data-index="${index}">Excluir</button>
            `;

            card.querySelector('button').addEventListener('click', () => {
                voluntarios.splice(index, 1);
                localStorage.setItem('voluntarios', JSON.stringify(voluntarios));
                renderizarVoluntarios(filtroInput.value);
            });

            lista.appendChild(card);
        }
    }

    filtroInput.addEventListener('input', () => {
        renderizarVoluntarios(filtroInput.value);
    });

    btnLimpar.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja apagar todos os voluntários?')) {
            localStorage.removeItem('voluntarios');
            voluntarios = [];
            renderizarVoluntarios();
        }
    });

    renderizarVoluntarios();
});


document.addEventListener('DOMContentLoaded', () => {
    const estaLogado = localStorage.getItem('isLoggedIn') === 'true';

    if (!estaLogado) {
        window.location.href = 'index.html';
    }

    // Iniciar controle de tempo de sessão (5 minutos = 300.000 ms)
    setTimeout(() => {
        localStorage.setItem('isLoggedIn', 'false');
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = 'index.html';
    }, 5 * 60 * 1000); // 5 minutos
});



async function buscarTemperatura(cidade) {
    if (!cidade) return 'Cidade indefinida';

    const chave = 'd860fe493f137f891193c28f9376a260'; // Sua chave OpenWeatherMap
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cidade)}&appid=${chave}&units=metric&lang=pt_br`;

    try {
        const resposta = await fetch(url);
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        const dados = await resposta.json();
        if (dados.main && dados.main.temp !== undefined) {
            return `${dados.main.temp.toFixed(1)}°C`;
        } else {
            return 'Temperatura indisponível';
        }
    } catch (erro) {
        console.error('Erro ao buscar temperatura:', erro);
        return 'Erro ao buscar temperatura';
    }
}
document.getElementById("cidade").value = data.localidade || "";
