# 1. Criar a planilha RH-DB

A planilha é o banco de dados do sistema. Tudo que o AppSheet e o Google
Agenda mostram vem daqui.

## Passo a passo

1. Acesse [Google Drive](https://drive.google.com) com a conta do RH.
2. `Novo` → `Planilhas Google` → renomeie o arquivo para **`RH-DB`**.
3. Crie **3 abas** na parte inferior, com os nomes exatos:
   - `Funcionarios`
   - `Vencimentos`
   - `Documentos`
4. Em cada aba, copie a linha de cabeçalho correspondente do arquivo
   [`sheets/schema.csv`](../sheets/schema.csv) e cole na **linha 1**.

## Colunas por aba

### Aba `Funcionarios`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | texto (UUID) | Gerado pelo AppSheet ao criar a linha |
| `nome` | texto | Nome completo |
| `cpf` | texto | Use formato `000.000.000-00` |
| `cargo` | texto | Cargo atual |
| `departamento` | texto | Ex: Produção, Administrativo |
| `data_admissao` | data | Data de admissão |
| `status` | texto | `ativo` ou `desligado` |
| `email_corporativo` | texto | E-mail da empresa |
| `foto` | imagem | Preenchido pelo AppSheet (upload) |

### Aba `Vencimentos`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | texto (UUID) | Gerado pelo AppSheet |
| `funcionario_id` | texto | Referência ao `id` do funcionário |
| `tipo` | texto | `contrato` / `ferias` / `prorrogacao` / `aso` |
| `data_vencimento` | data | Data em que vence |
| `observacoes` | texto | Campo livre |
| `calendar_event_id` | texto | **Não mexer** — preenchido pelo Apps Script |
| `sincronizado_em` | data-hora | **Não mexer** — preenchido pelo Apps Script |

### Aba `Documentos`

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | texto (UUID) | Gerado pelo AppSheet |
| `funcionario_id` | texto | Referência ao `id` do funcionário |
| `tipo` | texto | `epi` / `contrato_assinado` / `aso` / `atestado` / `outros` |
| `descricao` | texto | Texto livre (ex: "EPI 2026 - botas") |
| `arquivo_drive_url` | URL | Link do PDF no Drive (gerado pelo AppSheet) |
| `data_upload` | data-hora | Preenchido pelo AppSheet |

## Dicas

- **Congele a linha 1** em todas as abas: `Ver > Congelar > 1 linha`.
- **Não reordene colunas** nem renomeie. O Apps Script depende da ordem
  em `Vencimentos`.
- Se quiser adicionar campos (ex: `telefone` em Funcionarios), coloque
  **no final** da linha de cabeçalho, nunca no meio.

## Próximo passo

- [03 — Configurar Google Drive](./03-setup-drive.md) (crie a pasta de
  documentos antes do AppSheet).
