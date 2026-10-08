# Caixa Eletrônico

Simulação de saque em HTML, CSS e JavaScript. Sem frameworks, banco de dados ou instalação.

O saldo inicial é R$ 1.000,00. O caixa entrega notas de R$ 100, R$ 50, R$ 20, R$ 10, R$ 5 e R$ 2, sempre preferindo as de maior valor. R$ 1 e R$ 3 não podem ser sacados.

## Como abrir

Abra o arquivo `index.html` no navegador.

## Estrutura

```text
caixa-eletronico/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## Publicar no GitHub

Na pasta do projeto:

```bash
git init
git add .
git commit -m "Adiciona caixa eletrônico"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/caixa-eletronico.git
git push -u origin main
```

Troque `SEU-USUARIO` pelo seu usuário. O repositório precisa existir antes do `git remote`.
