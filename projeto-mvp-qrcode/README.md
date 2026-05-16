# 🎨 QReate Studio - QR Code Intelligent Designer

<div align="center">
<img width="1200" alt="QReate Studio Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 📝 Descrição do Projeto
O **QReate Studio** é uma plataforma avançada para a criação de QR Codes profissionais e personalizados. O diferencial do projeto é a integração com a **API Gemini (Google GenAI)**, permitindo que a inteligência artificial auxilie no design e na personalização dos códigos.

O sistema foi desenvolvido com foco em **privacidade, acessibilidade tais como: filtros para daltônicos, diversidade de idiomas** e uma experiência de usuário fluida através de temas claro/escuro e histórico local.

## 🚀 Tecnologias Utilizadas
O projeto utiliza uma stack moderna baseada em TypeScript e IA:

* **Core:** [React 19](https://react.dev/) & [Vite](https://vitejs.dev/)
* **Inteligência Artificial:** [@google/genai](https://ai.google.dev/) (Modelo Gemini)
* **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) & [Motion](https://motion.dev/) (animações)
* **Gerenciamento de Estado:** [Zustand](https://docs.pmnd.rs/zustand/)
* **Geração de QR:** [qr-code-styling](https://www.npmjs.com/package/qr-code-styling)
* **Backend/Integração:** Express & Firebase

## 📊 Funcionalidades Principais
* **IA-Powered Design:** Gere estilos e conceitos de QR Codes usando prompts de inteligência artificial.
* **Acessibilidade:** Suporte integrado a filtros daltônicos para garantir que os QR Codes sejam escaneáveis por todos.
* **Exportação Profissional:** Suporte para geração de PDFs via `jspdf`.
* **Customização Total:** Controle de cores, formas, logotipos e gradientes.
* **Privacidade:** Processamento focado no lado do cliente e histórico de usuário.

## 🔧 Como Executar

### Pré-requisitos
* **Node.js** (versão LTS recomendada)
* Uma chave de API do **Google Gemini**

### Passo a Passo
1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/vitinhobonilha13-zlqreate-studio.git](https://github.com/vitinhobonilha13-zl/qreate-studio.git)
    cd qreate-studio
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave:
    ```env
    GEMINI_API_KEY=sua_chave_aqui
    ```

4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
    O app estará disponível em `http://localhost:3000`.

## 🛠️ Scripts Disponíveis
* `npm run dev`: Inicia o ambiente de desenvolvimento.
* `npm run build`: Gera a versão de produção na pasta `dist`.
* `npm run lint`: Executa a verificação de tipos com TypeScript.
* `npm run clean`: Remove a pasta de build.

---
[⬆ Voltar ao topo](#-qreate-studio---qr-code-intelligent-designer)
