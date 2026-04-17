# 3. Estrutura do Google Drive

Os PDFs digitalizados (fichas de EPI, contratos assinados, ASOs, atestados)
ficam no Drive. O AppSheet organiza os arquivos automaticamente, mas a
pasta raiz precisa existir antes de o app subir o primeiro arquivo.

## Passo a passo

1. No [Google Drive](https://drive.google.com), crie uma pasta chamada
   **`RH`** na raiz do "Meu Drive" da conta do RH (ou no Drive compartilhado,
   se houver).
2. Dentro de `RH`, crie uma pasta **`Documentos`**.
3. Compartilhe a pasta `RH` apenas com os e-mails da equipe de RH:
   - Botão direito em `RH` → `Compartilhar`
   - Permissão: `Editor` (precisam poder anexar documentos pelo app).

## Como o AppSheet usa essa pasta

No AppSheet, a coluna `arquivo_drive_url` da tabela `Documentos` tem
a configuração `Folder path` = `RH/Documentos/<<[funcionario_id]>>`.

Isso faz com que, ao anexar um PDF pelo app, o AppSheet:
1. Crie (se ainda não existir) uma subpasta com o `id` do funcionário.
2. Suba o arquivo lá dentro.
3. Grave a URL completa do arquivo na coluna `arquivo_drive_url`.

Resultado:

```
RH/
└── Documentos/
    ├── 7f3a-.../        ← pasta do funcionário João
    │   ├── ficha-epi-2026.pdf
    │   └── contrato-assinado.pdf
    └── 91b2-.../        ← pasta da funcionária Maria
        └── aso-periodico-2026.pdf
```

## Boas práticas

- **Não renomeie** as subpastas manualmente — o AppSheet identifica pelo
  nome (que é o `id` do funcionário).
- **Não mova** arquivos para fora pelo Drive — isso quebra o link em
  `arquivo_drive_url`. Se precisar remover um documento, faça pelo app
  (exclui a linha em `Documentos`) e depois apague o arquivo no Drive.
- Para achar rápido um documento **fora do app**: na busca do Drive,
  busque pelo nome do funcionário ou do tipo de documento. Dentro do
  app AppSheet, use a view **Documentos** (filtros por funcionário e tipo).

## Próximo passo

- [02 — Construir o app AppSheet](./02-setup-appsheet.md) (se ainda não
  fez) ou [04 — Calendário](./04-setup-calendar.md).
