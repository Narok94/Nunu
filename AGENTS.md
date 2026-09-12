# Regras Globais do Projeto: Mundo da Nunu

1. **PROIBIDO O USO DE VOZ SINTETIZADA / TEXT-TO-SPEECH (TTS)**:
   - O aplicativo Mundo da Nunu **NÃO** utiliza nenhuma voz sintetizada, Web Speech API (`speechSynthesis`, `SpeechSynthesisUtterance`), narração automática ou falas gravadas.
   - Nenhuma interação (tocar alimento, arrastar objeto, acertar cor, concluir atividade, tocar na Nunu, avançar pela trilha, desbloquear nós) deve produzir voz humana ou sintetizada.
   - Qualquer chamada `speak()` deve ser desativada/inexistente.
   - Não adicione narração automaticamente em novos minijogos. Se no futuro houver narração, será com arquivos de áudio dedicados previamente aprovados.

2. **ÁREA INFANTIL SEM DEPENDÊNCIA DE LEITURA**:
   - As crianças que utilizam o app têm aproximadamente 3 anos e não sabem ler.
   - Toda a comunicação com a criança deve ser visual e sonora (ícones, mascote, cores, animações, efeitos sonoros suaves sem fala).
   - Textos de instrução e leitura devem ser evitados na área infantil; textos são permitidos apenas na área restrita dos pais.

3. **EFEITOS SONOROS (SEM FALA)**:
   - Permitidos e incentivados apenas efeitos sonoros infantis suaves gerados por Web Audio API ou chimes (ex.: pequenos "pops", som alegre de acerto, som de mordida/yum, estrelinhas, fanfarra musical sem voz).
   - O botão de controle de som altera apenas efeitos sonoros e música de fundo futura, sem jamais reativar narração por voz.
