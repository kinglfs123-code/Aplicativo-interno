/**
 * RH-DB -> Google Calendar
 *
 * Sincroniza a aba "Vencimentos" da planilha RH-DB com um calendario do
 * Google Agenda, criando um popup de lembrete 2 dias antes de cada
 * vencimento.
 *
 * Como rodar pela primeira vez: ver apps-script/README.md.
 */

// Nome exato do calendario no Google Agenda do RH.
const CALENDAR_NAME = 'RH - Vencimentos';

// Aba da planilha com os vencimentos.
const SHEET_NAME = 'Vencimentos';

// Minutos de antecedencia do popup. 2 dias = 2880.
const REMINDER_MINUTES_BEFORE = 2880;

// Indices das colunas na aba Vencimentos (1-based).
const COL = {
  ID: 1,
  FUNCIONARIO_ID: 2,
  TIPO: 3,
  DATA_VENCIMENTO: 4,
  OBSERVACOES: 5,
  CALENDAR_EVENT_ID: 6,
  SINCRONIZADO_EM: 7,
};

// Mapeia o valor bruto do tipo para um rotulo legivel no evento.
const TIPO_LABEL = {
  contrato: 'Contrato',
  ferias: 'Ferias',
  prorrogacao: 'Prorrogacao',
  aso: 'ASO/Exame',
};

/**
 * Ponto de entrada principal. Execute manualmente ou por trigger diario.
 */
function syncVencimentos() {
  const calendar = getOrCreateCalendar_(CALENDAR_NAME);
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) {
    throw new Error('Aba "' + SHEET_NAME + '" nao encontrada na planilha.');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return; // nada a sincronizar

  const range = sheet.getRange(2, 1, lastRow - 1, COL.SINCRONIZADO_EM);
  const values = range.getValues();
  const seenEventIds = {};
  const now = new Date();

  for (let i = 0; i < values.length; i++) {
    const row = values[i];
    const rowIndex = i + 2; // linha real na planilha

    const id = row[COL.ID - 1];
    const funcionarioId = row[COL.FUNCIONARIO_ID - 1];
    const tipo = String(row[COL.TIPO - 1] || '').toLowerCase().trim();
    const dataVenc = row[COL.DATA_VENCIMENTO - 1];
    const obs = row[COL.OBSERVACOES - 1];
    const eventId = row[COL.CALENDAR_EVENT_ID - 1];

    // Linha em branco ou incompleta: ignora (mas se tinha evento, limpa depois).
    if (!id || !funcionarioId || !tipo || !(dataVenc instanceof Date)) {
      continue;
    }

    const nomeFuncionario = lookupNomeFuncionario_(funcionarioId) || funcionarioId;
    const titulo = '[' + (TIPO_LABEL[tipo] || tipo) + '] ' + nomeFuncionario + ' - Vencimento';
    const descricao = buildDescricao_(funcionarioId, tipo, obs);

    let event;
    if (eventId) {
      event = safeGetEvent_(calendar, eventId);
    }

    if (!event) {
      // Cria novo evento de dia inteiro.
      event = calendar.createAllDayEvent(titulo, dataVenc, { description: descricao });
      applyReminder_(event);
      sheet.getRange(rowIndex, COL.CALENDAR_EVENT_ID).setValue(event.getId());
    } else {
      // Atualiza se algo mudou.
      if (event.getTitle() !== titulo) event.setTitle(titulo);
      if (event.getDescription() !== descricao) event.setDescription(descricao);
      const currentStart = event.getAllDayStartDate();
      if (!sameYMD_(currentStart, dataVenc)) {
        event.setAllDayDate(dataVenc);
      }
      applyReminder_(event);
    }

    seenEventIds[event.getId()] = true;
    sheet.getRange(rowIndex, COL.SINCRONIZADO_EM).setValue(now);
  }

  cleanupOrphanEvents_(calendar, seenEventIds);
}

/**
 * Remove eventos no calendario que nao correspondem mais a nenhuma linha
 * da planilha (linha apagada pelo RH).
 */
function cleanupOrphanEvents_(calendar, seenEventIds) {
  // Janela de varredura: de 1 ano atras ate 5 anos a frente.
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1);
  const end = new Date();
  end.setFullYear(end.getFullYear() + 5);

  const events = calendar.getEvents(start, end);
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (!seenEventIds[e.getId()]) {
      e.deleteEvent();
    }
  }
}

function applyReminder_(event) {
  // Substitui todos os lembretes por um unico popup 2 dias antes.
  event.removeAllReminders();
  event.addPopupReminder(REMINDER_MINUTES_BEFORE);
}

function safeGetEvent_(calendar, eventId) {
  try {
    return calendar.getEventById(eventId);
  } catch (err) {
    return null;
  }
}

function getOrCreateCalendar_(name) {
  const existing = CalendarApp.getCalendarsByName(name);
  if (existing && existing.length > 0) return existing[0];
  return CalendarApp.createCalendar(name, {
    summary: 'Vencimentos do RH - criado automaticamente',
    color: CalendarApp.Color.RED,
  });
}

function lookupNomeFuncionario_(funcionarioId) {
  const sheet = SpreadsheetApp.getActive().getSheetByName('Funcionarios');
  if (!sheet) return null;
  const last = sheet.getLastRow();
  if (last < 2) return null;
  // Coluna 1 = id, Coluna 2 = nome.
  const data = sheet.getRange(2, 1, last - 1, 2).getValues();
  for (let i = 0; i < data.length; i++) {
    if (data[i][0] === funcionarioId) return data[i][1];
  }
  return null;
}

function buildDescricao_(funcionarioId, tipo, obs) {
  const linhas = [
    'Funcionario: ' + funcionarioId,
    'Tipo: ' + (TIPO_LABEL[tipo] || tipo),
  ];
  if (obs) linhas.push('Obs: ' + obs);
  linhas.push('');
  linhas.push('Registro gerado automaticamente pela planilha RH-DB.');
  return linhas.join('\n');
}

function sameYMD_(a, b) {
  if (!(a instanceof Date) || !(b instanceof Date)) return false;
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

/**
 * Cria o trigger diario as 07h. Execute UMA vez manualmente apos instalar
 * o script (ver apps-script/README.md).
 */
function instalarTriggerDiario() {
  const triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'syncVencimentos') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger('syncVencimentos')
    .timeBased()
    .atHour(7)
    .everyDays(1)
    .create();
}
