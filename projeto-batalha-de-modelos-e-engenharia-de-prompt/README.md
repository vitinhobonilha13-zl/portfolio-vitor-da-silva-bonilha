# ⚔️ Batalha de Modelos & Engenharia de Prompt (XML)

## 📝 Descrição do Projeto
Este projeto documenta o desenvolvimento, aplicação e análise comparativa de um prompt estruturado utilizando a marcação XML. O objetivo principal é avaliar como diferentes modelos de Inteligência Artificial de Grande Porte (LLMs) interpretam diretrizes de design e restrições técnicas estruturadas para gerar uma aplicação web *Single Page* funcional.

Desenvolvido como parte de atividades acadêmicas pelos alunos **Felipe André Cruz Leite**, **Felipe Henrique Duranes Rodrigues** e **Vitor da Silva Bonilha** (RGM: 48123005), o trabalho consistiu em submeter o mesmo escopo estruturado a múltiplas ferramentas de IA do mercado (ChatGPT, Gemini, Claude, Qwen, DeepSeek, Grok e Maritaca), gerando um quadro analítico de desempenho técnico, criatividade e verbosidade (consumo de tokens).

---

## 📐 Estrutura do Prompt Desenvolvido (Tagging XML)
O prompt foi arquitetado utilizando tags hierárquicas para isolar o contexto e mitigar alucinações de layout:

* **`<tarefa>`:** Escopo macro da atividade.
* **`<objetivo>`:** Determinação de criar uma página HTML5 única com CSS3 interno (*single page*).
* **`<tema>`:** Definição do nicho de atuação do site, focado no universo de **Veículos** (carros e motos).
* **`<diretrizes_design>`:** Regras rígidas de interface, determinando layout responsivo e minimalista, paleta de cores (azul, preto e branco) e tipografia mista (Sans-serif para títulos e Serif para o corpo).
* **`<obrigatoriedades_tecnicas>`:** Elementos de código indispensáveis, como menu de navegação funcional por âncoras, seção de portfólio/galeria e rodapé preenchido com dados de contato simulados.
* **`<metrica_obrigatoria>`:** Instrução para o modelo estimar a quantidade total de tokens gerados ao final do código.

---

## 📊 Quadro de Análise Comparativa das IAs
Abaixo estão os dados consolidados obtidos a partir dos testes de execução em cada plataforma de IA:

| Critérios de Avaliação | GPT | Gemini | DeepSeek | Qwen | Grok | Maritaca | Claude |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Precisão Estimada do Prompt** | Boa, gostou muito | Muito boa, gostou muito | Bom, mas foi um pouco além | Boa, gostou muito | Muito bom, mas poderia ser melhor | Não superou as expectativas, até é bom | Boa, gostou muito |
| **Precisão do HTML** | Na média | Bom | Bom | Bom | Bom | Ruim | Muito bom |
| **Criatividade no Conteúdo** | Teve criatividade | Foi um pouco além do esperado | Teve muita criatividade, foi além | Teve bastante criatividade, foi além | Teve criatividade | Sem criatividade | Teve muita criatividade, foi além |
| **Erros de Sintaxe (Bugs)** | Faltou fotos e falhou no acesso às barras | Faltou fotos e falhou no acesso às barras | Faltou as fotos | Faltou as fotos | Falhas para acessar as barras | Falhas para acessar as barras | Faltou mais modelos de carros |
| **Quantidade de Tokens Gasta** | 1.200 tokens | 1.350 tokens | 1.850 tokens | 2.500 tokens | 1.850 tokens | 1.650 tokens | 5.000 tokens |

---

## 🚀 Resultados e Aprendizados (Reflexão Crítica)
O experimento trouxe conclusões sólidas a respeito do comportamento e da maturidade das ferramentas generativas de código:

* **Compreensão Estrutural:** O modelo **Claude** demonstrou a maior capacidade de interpretação da estrutura hierárquica fornecida pelas tags XML, resultando em um código HTML com excelente precisão técnica.
* **Verbosidade e Consumo:** Houve uma variação massiva na quantidade de tokens gerados para o mesmo escopo de prompt. Enquanto a maioria das IAs oscilou de forma econômica entre 1.200 e 2.500 tokens, o Claude gerou uma resposta densa de 5.000 tokens.
* **Tomada de Decisão Tecnológica:** A experiência evidenciou que, embora modelos menores sirvam para geração rápida, o **Claude** consolidou-se como a ferramenta mais robusta e completa para a prototipagem de códigos extensos e de arquitetura mais complexa.

---

## 🔧 Como Replicar este Experimento
1. Copie a estrutura XML especificada na seção de engenharia deste repositório.
2. Insira os seus dados de personalização de contato simulados nas tags de obrigatoriedade.
3. Cole o prompt estruturado na IA de sua preferência e analise o código gerado com base nos critérios estabelecidos (precisão, bugs visuais e contagem de tokens).

---
[Voltar ao início](https://github.com/vitinhobonilha13-zl)
