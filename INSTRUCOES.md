# 🚀 Como Rodar o Site da ORMED (Passo a Passo)

## Pré-requisitos

1. **Node.js** instalado no seu computador
   - Acesse: https://nodejs.org/
   - Baixe a versão **LTS** (a recomendada para a maioria dos usuários)
   - Instale clicando duas vezes no arquivo baixado

2. **VS Code** (editor de código) - Opcional mas recomendado
   - Acesse: https://code.visualstudio.com/
   - Baixe e instale

---

## 📦 Passo 1: Instalar Dependências

Abra o **Terminal** (ou Prompt de Comando no Windows) na pasta do projeto:

```bash
npm install
```

Isso vai instalar todas as bibliotecas necessárias. Pode demorar alguns minutos.

---

## ▶️ Passo 2: Rodar o Site

Ainda no terminal, na pasta do projeto:

```bash
npm run dev
```

O site vai abrir automaticamente no seu navegador em:
**http://localhost:3000**

---

## 🏗 Passo 3: Gerar Versão Final (Build)

Quando quiser gerar a versão final do site:

```bash
npm run build
```

Os arquivos finais ficarão na pasta `dist/`. É essa pasta que você sobe para o servidor de hospedagem.

---

## ❌ Problemas Comuns

### Erro: "Cannot find module 'tailwindcss-animate'"

**Solução:** Rode este comando:
```bash
npm install tailwindcss-animate
```

### Erro: "Cannot find module 'next'"

**Solução:** Delete a pasta `node_modules` e o arquivo `package-lock.json`, depois rode:
```bash
npm install
```

### O site não abre no navegador

**Solução:** Abra manualmente o endereço: **http://localhost:3000**

---

## 📁 Estrutura das Pastas

```
ordem-dos-medicos-angola/
├── app/              ← Páginas do site
├── components/       ← Componentes reutilizáveis
├── lib/              ← Dados e utilitários
├── public/           ← Imagens e arquivos estáticos
├── package.json      ← Lista de dependências
└── next.config.js    ← Configuração do Next.js
```

---

## 🎨 Personalizar

- **Cores:** Edite o arquivo `tailwind.config.ts`
- **Textos:** Edite o arquivo `lib/data.ts`
- **Imagens:** Coloque na pasta `public/images/`

---

## 📞 Precisa de Ajuda?

Se tiver problemas, verifique:
1. Node.js está instalado: `node --version`
2. Você está na pasta correta do projeto
3. Rodou `npm install` antes de `npm run dev`
