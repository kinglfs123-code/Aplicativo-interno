# Apps Script — sincronização Sheets → Google Agenda

Este script lê a aba `Vencimentos` da planilha **RH-DB** e mantém um
calendário dedicado (`RH - Vencimentos`) no Google Agenda, criando um
lembrete popup **2 dias antes** de cada vencimento.

## Instalação (5 minutos)

1. Abra a Google Sheet **RH-DB** (criada conforme `docs/01-setup-sheets.md`).
2. Menu `Extensões` → `Apps Script`. Vai abrir um editor em nova aba.
3. No editor, apague o conteúdo de `Code.gs`.
4. Cole o conteúdo de [`calendar-sync.gs`](./calendar-sync.gs) nesse arquivo.
5. Clique no ícone de engrenagem (Configurações do projeto) no menu lateral.
   - Marque "Mostrar o arquivo de manifesto `appsscript.json` no editor".
6. Volte para o editor e abra `appsscript.json`; substitua pelo conteúdo de
   [`appsscript.json`](./appsscript.json) deste repositório.
7. Clique em **Salvar** (ícone de disquete).
8. Com o arquivo `calendar-sync.gs` aberto, escolha a função
   `syncVencimentos` na barra superior e clique em **Executar**.
   - Na primeira execução o Google pedirá autorização (Calendar + Sheets).
     Autorize com a conta do RH.
9. Ainda no editor, selecione a função `instalarTriggerDiario` e clique em
   **Executar** uma única vez. Isso agenda a sincronização automática
   todo dia às 07h.

## Verificar se funcionou

- Abra o Google Agenda → barra lateral esquerda → deve aparecer um
  calendário novo chamado **RH - Vencimentos**.
- Cadastre um vencimento de teste na planilha com data = hoje + 5 dias,
  rode `syncVencimentos` manualmente e abra o evento no Agenda:
  - Data correta.
  - Lembrete "Notificação: 2 dias antes".
  - Coluna `calendar_event_id` preenchida na planilha.

## Manutenção

- **Mudou a data de um vencimento na planilha?** Basta esperar o trigger
  diário (07h) ou rodar `syncVencimentos` manualmente — o evento existente
  é atualizado, não duplicado.
- **Apagou uma linha da planilha?** O trigger diário remove o evento
  correspondente do Agenda automaticamente.
- **Quer mudar a antecedência do lembrete?** Edite a constante
  `REMINDER_MINUTES_BEFORE` no topo de `calendar-sync.gs`
  (valor em minutos: 2880 = 2 dias, 4320 = 3 dias etc.).

## Troubleshooting

| Sintoma | Causa provável | Correção |
|---|---|---|
| "Aba Vencimentos não encontrada" | Aba renomeada | Renomeie de volta para `Vencimentos` ou ajuste `SHEET_NAME` |
| Eventos duplicados | Script foi colado em dois projetos | Desinstale triggers duplicados em `Triggers` (ícone de relógio) |
| Nada acontece às 07h | Trigger não instalado | Rode `instalarTriggerDiario` novamente |
| "Authorization required" ao rodar | Autorização expirou | Rode `syncVencimentos` manualmente e re-autorize |
