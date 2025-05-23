# Prova de Programação Web - Cadastro de Voluntários
---

## Sistema de Login e Controle de Acesso

- O sistema possui um login simples para controle de acesso.
- As credenciais padrão de administrador são:

  - **Usuário:** admin  
  - **Senha:** 123456

- Usuários que não estiverem logados são redirecionados para a página de login.
- Após o login com sucesso, o usuário pode acessar todas as funcionalidades do sistema.
- O login é controlado via `localStorage`, mantendo o estado da sessão até o logout ou fechamento do navegador.

Para testar o sistema, utilize o login acima ou cadastre novos usuários (se essa funcionalidade estiver disponível).

---

Projeto desenvolvido como parte de uma prova prática de Programação Web.  
Este sistema permite o cadastro de voluntários com validação de dados, busca automática de endereço via CEP, exibição em cards com fotos aleatórias e consulta da temperatura atual na cidade.

---

## Funcionalidades

- Cadastro de voluntários com nome, email, CEP, endereço, bairro e cidade.
- Validação de dados do formulário.
- Busca automática do endereço pelo CEP usando a API ViaCEP.
- Exibição dos voluntários cadastrados em cards com foto aleatória (Unsplash).
- Exibição da temperatura atual na cidade do voluntário (OpenWeatherMap).
- Prevenção de cadastro com email duplicado.
- Filtro de voluntários em tempo real pelo nome.
- Exclusão individual de voluntários e limpeza total da lista.
- Sistema simples de login/logout com controle via `localStorage`.

---

## Tecnologias Utilizadas

- HTML5  
- CSS3  
- JavaScript (ES6+)  
- APIs externas:
  - [ViaCEP](https://viacep.com.br/) - Consulta de CEP e endereço.
  - [OpenWeatherMap](https://openweathermap.org/) - Temperatura atual.
  - [Unsplash](https://unsplash.com/developers) - Imagens aleatórias.

---
