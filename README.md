# Snippets Tool

![Imagem de Introdução](https://i.ibb.co/N2LSbw6Y/banner.png)

Snippets é uma plataforma prática e eficiente, criada para desenvolvedores que buscam uma solução simples para armazenar, organizar e compartilhar trechos de código.

---

## Índice

1. [Visão Geral](#visão-geral)
2. [Escopo do Projeto](#escopo-do-projeto)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Pré-requisitos](#pré-requisitos)
5. [Instalação](#instalação)
6. [Configuração do Firebase](#configuração-do-firebase)
7. [Como Rodar o Projeto](#como-rodar-o-projeto)
8. [Estrutura do Projeto](#estrutura-do-projeto)

---

## Visão Geral

- Organização Inteligente: Classifique seus códigos com tags personalizadas, facilitando a busca e a organização.
- Compartilhamento Simplificado: Torne seus códigos públicos ou privados, promovendo colaboração com a comunidade de desenvolvedores.
- Acesso Seguro: Acesse e armazene seus códigos de maneira segura de qualquer dispositivo.

---

## Escopo do Projeto

O escopo deste projeto é criar uma aplicação escalável, com a capacidade de gerenciar autenticação de usuários, armazenar e recuperar dados em tempo real e fornecer uma interface de usuário interativa. As funcionalidades principais incluem:

- Autenticação de usuários com **NextAuth.js**.
- Armazenamento e gerenciamento de dados de usuários no **Firebase Firestore**.
- Criação de uma interface de usuário responsiva com **Next.js**.
- Utilização de **TypeScript** para garantir maior segurança e robustez no código.

---

## Tecnologias Utilizadas

- **Next.js**
- **NextAuth.js**
- **Firebase**
- **TypeScript**

---

## Pré-requisitos

- Node.js
- Yarn (opcional)
- Conta no Firebase

---

## Instalação

1. Instale as dependências:

    ```bash
    npm install
    # ou
    yarn install
    ```

---

## Configuração do Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/).
2. Crie um novo projeto ou use um projeto existente.
3. Ative os serviços necessários (Autenticação, Firestore, etc.).
4. No arquivo `/src/service/firebaseConnection.ts`, configure a conexão com o Firebase utilizando variáveis de ambiente para as credenciais. Isso garante maior segurança no seu código. Abaixo está um exemplo de como configurar::

    ```ts
    const firebaseConfig = {
      apiKey: "AIzaSyBLUPdYQ6RiWbH8szw7YbmCiioVvfDGbC4",
      authDomain: "snippetsdatabase-b7b44.firebaseapp.com",
      projectId: "snippetsdatabase-b7b44",
      storageBucket: "snippetsdatabase-b7b44.firebasestorage.app",
      messagingSenderId: "367715969584",
      appId: "1:367715969584:web:a95894304521e00a4fdbf5"
    }
    ```

---

## Como Rodar o Projeto

1. Para rodar o projeto em desenvolvimento:

    ```bash
    npm run dev
    # ou
    yarn dev
    ```

2. Acesse `http://localhost:3000` no seu navegador.

## Estrutura do Projeto

A estrutura do projeto segue uma organização lógica para facilitar o desenvolvimento e a manutenção:

- **`/pages`**: Contém as páginas principais da aplicação, como as rotas de autenticação (`/auth`) e as rotas públicas ou privadas do sistema.
- **`/components`**: Contém componentes reutilizáveis, como cards, cabeçalhos, modais, etc.
- **`/service`**: Funções utilitárias e configuração do Firebase e outros serviços.
- **`/styles`**: Arquivos de estilo, seja em CSS, SASS ou CSS-in-JS, aplicados globalmente ou por componente.

---
