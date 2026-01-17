🩺 Projecto TOSSE - Diagnóstico Respiratório por IA
Este projeto, desenvolvido para a cadeira de Engenharia do Conhecimento (5º Ano), utiliza Inteligência Artificial para analisar amostras acústicas de tosse e auxiliar na identificação de patologias respiratórias.

📋 Funcionalidades (Fluxo de 5 Telas)
Boas-Vindas: Introdução ao sistema de diagnóstico.

Cadastro do Utente: Recolha de dados demográficos e consentimento ético.

Gravação da Tosse: Captura de áudio em tempo real (16kHz, Mono).

Análise por IA: Classificação instantânea com scores de confiança.

Relatório PDF: Geração de laudo detalhado para partilha médica.

🚀 Tecnologias e Arquitetura
O sistema foi projetado para correr localmente no dispositivo (Edge Computing), garantindo a privacidade do utente.

1. Processamento de Sinal
Frequência: 16kHz (padrão clínico).

Filtros: Aplicação de filtros Wiener e Butterworth para redução de ruído ambiente.

Features: Extração de coeficientes MFCC e Espectrogramas Log-Mel.

2. Inteligência Artificial (Antigravity/TFLite)
Modelo: Rede Neural Convolucional (CNN) baseada em MobileNetV2.

Classes de Diagnóstico:

Pneumonia

Bronquite

Asma

Normal (Sem patologia aparente)

📂 Estrutura do Repositório
/lib: Interface construída no Stitch UI.

/assets: Modelo de IA (.tflite) e pesos.

/scripts: Processamento de áudio e lógica de PDF.

⚖️ Aviso Legal
Este software é uma ferramenta de auxílio à decisão e não substitui o diagnóstico de um profissional de saúde qualificado.

Como usar este README no GitHub:

Vá à página do seu repositório: https://github.com/Emanuel083/projeto-da-tosse-Emanuel.

Clique em "Add file" -> "Create new file".

Dê o nome de README.md.

Cole o texto acima e clique em "Commit changes".
