# 4. Configurar o calendário no Google Agenda

Os vencimentos são projetados em um calendário dedicado do Google Agenda
— separado da agenda pessoal — para que a equipe de RH possa ligar/desligar
e compartilhar facilmente.

## 4.1 Criar o calendário

Você tem duas opções:

### Opção A (recomendada) — deixar o Apps Script criar automaticamente

O script [`apps-script/calendar-sync.gs`](../apps-script/calendar-sync.gs)
cria o calendário **RH - Vencimentos** na primeira execução, se ele não
existir. Basta seguir o setup do Apps Script
([`apps-script/README.md`](../apps-script/README.md)).

### Opção B — criar manualmente

1. Acesse [Google Agenda](https://calendar.google.com).
2. Na barra lateral esquerda, ao lado de "Outros Agendas", clique no
   `+` → `Criar agenda`.
3. Nome: **`RH - Vencimentos`** (exatamente esse nome — o script procura
   por ele).
4. Descrição: "Vencimentos de contrato, férias, prorrogação e ASO".
5. Fuso horário: `(GMT-03:00) Brasília`.
6. Clique em **Criar agenda**.

## 4.2 Compartilhar com o time de RH

1. Passe o mouse sobre `RH - Vencimentos` na barra lateral → 3 pontinhos
   → `Configurações e compartilhamento`.
2. Em **Compartilhar com pessoas específicas**, clique em
   `Adicionar pessoas`.
3. Adicione os e-mails da equipe de RH com permissão
   `Fazer alterações em eventos`.

## 4.3 Ajustar a antecedência dos lembretes (opcional)

O padrão já é **popup 2 dias antes** de cada vencimento. Se quiser mudar:

- Abra `apps-script/calendar-sync.gs`.
- No topo, mude `REMINDER_MINUTES_BEFORE`:
  - `2880` = 2 dias (padrão)
  - `4320` = 3 dias
  - `10080` = 7 dias
- Salve e rode `syncVencimentos` uma vez — os eventos existentes terão o
  novo lembrete aplicado.

## 4.4 Como a equipe vai ver os avisos

- No dia `D-2` às 00h (horário de Brasília), cada pessoa com o calendário
  compartilhado recebe uma notificação popup.
- A notificação aparece no navegador (Gmail/Calendar abertos) e no celular
  (se o app Google Agenda estiver instalado com notificações ligadas).
- No próprio Google Agenda, os eventos aparecem coloridos de vermelho
  (cor padrão do calendário criado pelo script).

## Próximo passo

- Voltar ao [README principal](../README.md) e fazer o **teste
  end-to-end** descrito lá.
