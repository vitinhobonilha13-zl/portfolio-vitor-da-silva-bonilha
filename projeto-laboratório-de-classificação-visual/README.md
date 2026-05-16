# 🧠 Laboratório de Classificação Visual: Treinando IA com Imagens

## 📝 Descrição do Projeto
Este projeto consiste no desenvolvimento e análise de um modelo de visão computacional voltado para o reconhecimento de expressões faciais. O objetivo principal é treinar uma inteligência artificial capaz de classificar de forma binária se um indivíduo está sorrindo ou não, avaliando criticamente os impactos práticos do viés de dados na acurácia do algoritmo.

Desenvolvido como parte de atividades acadêmicas pelos alunos **Felipe Henrique Duranes Rodrigues** e **Vitor da Silva Bonilha** (RGMs: 48139181 e 48123005), o laboratório compreende o carregamento de amostras visuais, parametrização do treinamento e uma reflexão técnica sobre as implicações sociais e técnicas decorrentes de dados limitados no aprendizado de máquina.

---

## 🎨 Estrutura de Classes e Configuração do Modelo

### 🤖 1. Base de Dados de Imagens (Datasets)
O modelo foi estruturado a partir de duas classes distintas de amostragem visando o reconhecimento facial:
* **Classe 1 — Não está sorrindo:** Conjunto composto por 10 amostras digitais de imagens de rostos sérios ou neutros.
* **Classe 2 — Está sorrindo:** Conjunto composto por 10 amostras digitais de imagens capturando expressões de sorriso.

### 📜 2. Parâmetros de Treinamento (Hyperparameters)
A otimização do aprendizado na plataforma utilizou técnicas padrão para ajuste de rede, permitindo o refinamento do comportamento preditivo através de variáveis avançadas:
* **Epochs (Épocas):** Quantidade de ciclos completos que o algoritmo processa o conjunto de dados para ajustar seus pesos.
* **Batch Size (Tamanho do Lote):** O volume de amostras de imagens propagadas pela rede por vez antes de atualizar os parâmetros internos.
* **Learning Rate (Taxa de Aprendizado):** Fator de ajuste fino que dita o tamanho dos passos dados em direção à minimização dos erros.

---

## 🚀 Tecnologias e Conceitos Aplicados
* **Ferramentas de IA:** Teachable Machine com suporte do Google (Plataforma no-code para prototipagem ágil de Machine Learning).
* **Visão Computacional:** Processamento digital de imagens, classificação multiclasse de expressões e extração automática de padrões geométricos faciais.
* **Mecanismos de Ajuste:** Otimização via interface web baseada no balanço de amostras de imagem por classe.

---

## 📊 Resultados e Aprendizados (Análise Crítica)
O projeto permitiu compreender a profunda ligação entre a qualidade dos dados de entrada e a integridade ética do software:

* **Mecanismo do Viés:** A seleção restrita ou homogênea de dados não causa apenas falhas técnicas comuns. Ela embuti uma "ideologia no código", fazendo com que o algoritmo ignore variações e passe a enxergar experiências humanas diferentes como "erros" ou "exceções".
* **Consequência Social:** A falta de dados abrangentes gera classificações falhas no mundo real. Mudanças simples de ambiente
