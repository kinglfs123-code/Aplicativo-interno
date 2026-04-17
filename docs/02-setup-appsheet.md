# 2. Construir o app AppSheet

Tempo estimado: **30–45 minutos**.

Pré-requisitos:
- Planilha `RH-DB` criada ([01-setup-sheets.md](./01-setup-sheets.md)).
- Pasta `RH/Documentos/` criada no Drive ([03-setup-drive.md](./03-setup-drive.md)).

## 2.1 Criar o app

1. Acesse [appsheet.com](https://www.appsheet.com) e entre com a conta do RH.
2. `Create` → `App` → `Start with existing data`.
3. Selecione a planilha **RH-DB** → o AppSheet importará a aba
   `Funcionarios` como primeira tabela.

## 2.2 Adicionar as outras tabelas

No menu lateral: `Data` → `Tables` → `+ New Table`.

Adicione:
- `Vencimentos` (aponte para a aba `Vencimentos`)
- `Documentos` (aponte para a aba `Documentos`)

Em cada tabela, marque todas as permissões: **Updates, Adds, Deletes**.

## 2.3 Configurar colunas

### Tabela `Funcionarios`

| Coluna | Type | Key | Show? | Outras configs |
|---|---|---|---|---|
| `id` | Text | ✔ | ✗ | `Initial value`: `UNIQUEID()` |
| `nome` | Text | | ✔ | `Required`: Yes, `Label`: Yes |
| `cpf` | Text | | ✔ | `Required`: Yes |
| `cargo` | Text | | ✔ | |
| `departamento` | Enum | | ✔ | Valores: conforme sua empresa |
| `data_admissao` | Date | | ✔ | |
| `status` | Enum | | ✔ | Valores: `ativo`, `desligado` |
| `email_corporativo` | Email | | ✔ | |
| `foto` | Image | | ✔ | |

### Tabela `Vencimentos`

| Coluna | Type | Key | Show? | Outras configs |
|---|---|---|---|---|
| `id` | Text | ✔ | ✗ | `Initial value`: `UNIQUEID()` |
| `funcionario_id` | Ref | | ✔ | `Source table`: Funcionarios; marque **Is a part of?** |
| `tipo` | Enum | | ✔ | Valores: `contrato`, `ferias`, `prorrogacao`, `aso` |
| `data_vencimento` | Date | | ✔ | `Required`: Yes |
| `observacoes` | LongText | | ✔ | |
| `calendar_event_id` | Text | | ✗ | **Não editável** (Editable?: `FALSE`) |
| `sincronizado_em` | DateTime | | ✗ | **Não editável** |

### Tabela `Documentos`

| Coluna | Type | Key | Show? | Outras configs |
|---|---|---|---|---|
| `id` | Text | ✔ | ✗ | `Initial value`: `UNIQUEID()` |
| `funcionario_id` | Ref | | ✔ | `Source table`: Funcionarios; marque **Is a part of?** |
| `tipo` | Enum | | ✔ | Valores: `epi`, `contrato_assinado`, `aso`, `atestado`, `outros` |
| `descricao` | Text | | ✔ | |
| `arquivo_drive_url` | File | | ✔ | Em `Folder path`: `RH/Documentos/<<[funcionario_id]>>` |
| `data_upload` | DateTime | | ✔ | `Initial value`: `NOW()`, Editable?: `FALSE` |

> O tipo **File** no AppSheet faz o upload para uma subpasta do Drive.
> A expressão em `Folder path` cria automaticamente uma pasta por
> funcionário.

## 2.4 Criar as Views

Menu `UX` → `Views`.

### View 1 — Funcionários
- **View type**: `card`
- **For this data**: `Funcionarios`
- **Sort**: `nome ASC`
- **Main image**: `foto`
- **Primary header**: `nome`
- **Secondary header**: `cargo` + `departamento`
- **Position**: `first`

### View 2 — Vencimentos
- **View type**: `calendar`
- **For this data**: `Vencimentos`
- **Start date**: `data_vencimento`
- **Description**: `CONCATENATE([tipo], " - ", LOOKUP([funcionario_id], "Funcionarios", "id", "nome"))`
- **Category**: `tipo` (gera cores diferentes por tipo)
- **Position**: `menu`

### View 3 — Documentos
- **View type**: `gallery`
- **For this data**: `Documentos`
- **Primary header**: `descricao`
- **Secondary header**: `tipo`
- **Group by**: `funcionario_id`
- **Position**: `menu`

### View 4 — Detalhe do funcionário (já vem gratuita)
- Abra `Funcionarios_Detail` (gerada automaticamente).
- Em `Related`, confirme que aparecem duas seções:
  - **Related Vencimentos** (via `Ref` em Vencimentos.funcionario_id)
  - **Related Documentos** (via `Ref` em Documentos.funcionario_id)

## 2.5 Testar

1. Botão `Save` no canto superior direito do editor AppSheet.
2. Clique em `Preview` (lado direito).
3. Cadastre 1 funcionário de teste.
4. Entre no detalhe → adicione 1 vencimento com data = hoje + 5 dias.
5. Anexe 1 PDF em documentos.
6. Volte para a planilha: as linhas devem aparecer preenchidas.
7. Abra o Drive: o PDF está em `RH/Documentos/<id-do-funcionario>/`.

## 2.6 Distribuir para o time de RH

Em `Users` → `Users`, adicione os e-mails da equipe de RH. Cada um
receberá um link para abrir o app no navegador ou no app AppSheet do
celular — sem login extra (já autenticados no Google).

## Próximo passo

- [04 — Configurar o calendário do Google Agenda](./04-setup-calendar.md).
