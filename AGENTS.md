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

4. **EXPERIÊNCIA INFANTIL PRIORITARIAMENTE EM MODO HORIZONTAL (LANDSCAPE-FIRST)**:
   - Toda a área infantil (Home, Trilha de Aventuras e os 10 Minijogos) é concebida e validada prioritariamente em **Landscape (Horizontal)**.
   - **Dispositivos de Referência**: iPhone 11 (896x414 landscape com notch) e iPhone 16 (landscape com Dynamic Island). Se funcionar confortavelmente no iPhone 11, adapta-se com maestria ao iPhone 16.
   - **Safe Areas Mandatórias**: Respeitar `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, `env(safe-area-inset-left)` e `env(safe-area-inset-right)`. Nenhum botão ou alvo interativo pode ficar atrás do notch, ilha dinâmica ou indicador de início (home bar).
   - **Layout Verdadeiramente Horizontal**: Composição pensada para a largura da tela (ex.: controles laterais para dois polegares, divisão equilibrada esquerda/direita, alvos grandes com no mínimo 64px a 88px, sem dependência de telas grandes ou rolagem vertical forçada).
   - **Orientação Portrait Resiliente**: Em portrait, exibir orientação visual amigável (sem texto) sugerindo girar o aparelho para a horizontal, garantindo que a experiência nunca fique quebrada ou cortada.
