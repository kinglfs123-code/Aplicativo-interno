# Aplicativo Interno de RH

Sistema no-code para centralizar dados de funcionários, anexar documentos
digitalizados (fichas de EPI, contratos assinados, ASOs) e **avisar
automaticamente** no Google Agenda 2 dias antes de cada vencimento de:

- Contrato
- Férias
- Prorrogação de contrato
- ASO / exames periódicos

Uso restrito à equipe de RH. Não exige login extra: cada pessoa acessa
com a própria conta Google corporativa já autenticada no navegador.

## Arquitetura

```
AppSheet (UI que o RH usa)
   │ lê/escreve
   ▼
Google Sheets "RH-DB"  (3 abas: Funcionarios, Vencimentos, Documentos)
   │ trigger diário às 07h (Apps Script)
   ▼
Google Agenda "RH - Vencimentos"  (popup 2 dias antes)

AppSheet ──(upload de PDF)──►  Google Drive  /RH/Documentos/<funcionário>/
```

Nada roda em servidor próprio. Toda a stack é Google: Sheets é o banco,
AppSheet é a interface, Drive é o armazenamento, Agenda é o alerta.

## Estrutura do repositório

```
.
├── README.md                       ← você está aqui
├── docs/
│   ├── 01-setup-sheets.md          Criar a planilha RH-DB
│   ├── 02-setup-appsheet.md        Construir o app AppSheet
│   ├── 03-setup-drive.md           Estrutura de pastas do Drive
│   └── 04-setup-calendar.md        Calendário "RH - Vencimentos"
├── sheets/
│   └── schema.csv                  Cabeçalhos das 3 abas
└── apps-script/
    ├── calendar-sync.gs            Sincronização Sheets → Calendar
    ├── appsscript.json             Manifesto com os scopes necessários
    └── README.md                   Como colar e rodar pela 1ª vez
```

## Setup em 4 passos (~1h)

1. [Criar a planilha RH-DB](./docs/01-setup-sheets.md) (~5 min)
2. [Configurar a pasta no Drive](./docs/03-setup-drive.md) (~5 min)
3. [Construir o app AppSheet](./docs/02-setup-appsheet.md) (~30–45 min)
4. [Calendário + Apps Script](./docs/04-setup-calendar.md) +
   [instalar o script](./apps-script/README.md) (~10 min)

## Teste end-to-end

Depois do setup, faça este teste para garantir que tudo está funcionando:

1. No AppSheet, cadastre um funcionário fictício (ex: "João Teste").
2. Cadastre um vencimento de contrato com data = **hoje + 5 dias**.
3. No editor Apps Script, execute `syncVencimentos` manualmente.
4. Abra o [Google Agenda](https://calendar.google.com) e confirme:
   - Evento `[Contrato] João Teste - Vencimento` no dia correto.
   - Calendário **RH - Vencimentos** selecionado.
   - Lembrete configurado: **2 dias antes**.
5. De volta ao AppSheet, edite o vencimento mudando a data.
6. Rode `syncVencimentos` de novo e confirme que o evento no Agenda
   foi atualizado (não duplicado).
7. Anexe um PDF no detalhe do funcionário → confira em
   `Drive/RH/Documentos/<id-do-joao>/` que o arquivo subiu.
8. Apague o vencimento no app, rode o script, confirme que o evento
   sumiu do Agenda.

Se tudo isso funcionar, o sistema está pronto para o time usar.

## Dia a dia do RH

- **Cadastrar funcionário**: app AppSheet → view "Funcionários" →
  botão `+`.
- **Registrar vencimento**: abra o funcionário → aba "Vencimentos" →
  botão `+` → tipo + data.
- **Anexar documento assinado**: abra o funcionário → aba "Documentos"
  → botão `+` → tipo + descrição + upload do PDF.
- **Ver tudo que vence nos próximos meses**: view "Vencimentos" →
  modo calendário.
- **Buscar um documento específico**: view "Documentos" → filtro por
  funcionário + tipo.

## Customização comum

| Necessidade | Onde mexer |
|---|---|
| Mudar antecedência do aviso (ex: 7 dias) | `apps-script/calendar-sync.gs` → `REMINDER_MINUTES_BEFORE` |
| Adicionar um novo tipo de vencimento | AppSheet (Enum da coluna `tipo`) + `TIPO_LABEL` no script |
| Adicionar um campo em Funcionarios | Planilha (coluna ao **final**) + AppSheet regenera colunas |
| Mudar o nome do calendário | `apps-script/calendar-sync.gs` → `CALENDAR_NAME` |

## Fora do escopo (v1)

- Portal de acesso para funcionários (hoje só RH).
- Assinatura eletrônica integrada — anexo manual é suficiente.
- Notificações por WhatsApp/e-mail.
- Relatórios analíticos (headcount, turnover).

Esses itens podem entrar em versões futuras. Por ora, o foco é resolver o
gargalo operacional: documentar tudo e **não perder prazos**.
