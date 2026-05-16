# 🏎️ A Corrida do Prompt

## 📝 Descrição do Projeto
Este projeto documenta o processo de engenharia de prompt iterativa (prompt-chaining) aplicado à geração de conteúdo multimodal (imagens e textos históricos simulados). O objetivo principal é demonstrar como o refinamento contínuo de instruções fornecidas a modelos de Inteligência Artificial Generativa altera, expande e contextualiza as saídas geradas, mitigando alucinações e alcançando resultados hiper-específicos.

Desenvolvido como parte de atividades acadêmicas pelos alunos **Felipe Henrique Duranes Rodrigues** e **Vitor da Silva Bonilha** (RGMs: 48139181 e 48123005), o trabalho divide-se em duas dinâmicas práticas principais:
1. **Engenharia de Imagem Iterativa:** A construção progressiva de um cenário surrealista em Marte envolvendo personalidades e elementos pop/históricos.
2. **Refinamento de Texto de Época:** A criação e posterior síntese de missivas formais de desculpas utilizando instrução linguística do século XVII e XVIII.

---

## 🎨 Linha do Tempo de Engenharia de Prompts

### 🤖 1. Geração de Imagens Progressivas (Multimodal)
O ecossistema visual evoluiu através de quatro iterações consecutivas baseadas no feedback do usuário sobre os resultados parciais:

* **Prompt 1 (Base):** *"Faça uma imagem de astronauta estilo barroco tocando violoncelo em marte e que esse astronauta seja o Adam Sandler"*.
* **Prompt 2 (Expansão de cenário):** *"Ficou boa. Mas adicione um alien tocando piano no fundo"*.
* **Prompt 3 (Inserção de anacronismo):** *"Ficou muito boa. Agora adicione o neymar Junior levantando a taça da copa do mundo no fundo"*.
* **Prompt 4 (Correção de consistência contextual):** *"Ficou muito boa! Mas adicione o uniforme da seleção brasileira no neymar"*.

### 📜 2. Geração e Otimização de Textos (Linguagem de Época)
Simulação de e-mails formais utilizando técnicas de *Role-play* e *Refinamento de Tom* para emular a comunicação entre piratas e monarcas absolutistas:

* **Abordagem de Contexto Histórico (1682):** Geração de súplica com foco em submissão armada (Capitão Elias Blackwood para o Rei).
* **Abordagem de Reparação e Suborno (1718):** Inclusão de termos de devolução de espólio e mapas náuticos (Capitão Thomas "Albatroz" Vance).
* **Abordagem Refinada (1724):** Aplicação do prompt *"mais refinados"* para elevar o nível de erudição linguística (Capitão Alexander Thorne).
* **Abordagem Sintetizada:** Aplicação do prompt *"ficou bom, mas dá para resumir?"* para testar a capacidade de concisão do modelo sem perda do tom solene original.

---

## 🚀 Tecnologias e Conceitos Aplicados
* **Ferramentas de IA:** Modelos Generativos de Imagem (Text-to-Image / Image-to-Image) e Modelos de Linguagem de Grande Porte (LLMs).
* **Técnicas de Engenharia de Prompt:**
  * *Contextual Prompting* (Estilo Barroco, Linguagem Colonial).
  * *Iterative Feedback Loops* (Modificações baseadas no resultado anterior).
  * *Constraint Handling* (Resumos e restrições de estilo).

---

## 📊 Resultados e Aprendizados
O projeto demonstrou a importância do controle de contexto na IA generativa:
* **Precisão de Atributos:** O modelo demonstrou capacidade de preservar o sujeito principal (Adam Sandler / Estilo Barroco) enquanto adicionava camadas secundárias ao plano de fundo.
* **Flexibilidade Estilística:** A IA adaptou com sucesso o jargão epistolar náutico para diferentes anos-base (1682, 1718, 1724), mantendo a coesão gramatical arcaica.
* **Capacidade de Resumo:** A compressão de texto provou que restrições de tamanho podem coexistir com restrições de tom estilístico pesado.

---

## 🔧 Como Executar a Replicação
Para replicar os experimentos deste projeto em qualquer LLM ou gerador de imagens atual:
1. Abra a interface da IA de sua escolha.
2. Execute sequencialmente os comandos listados na seção **"Linha do Tempo de Engenharia de Prompts"** deste documento.
3. Certifique-se de manter a mesma sessão de chat ativa para que o modelo utilize o histórico de contexto adequadamente.

---
[Voltar ao início](https://github.com/seu-usuario/seu-repositorio)
