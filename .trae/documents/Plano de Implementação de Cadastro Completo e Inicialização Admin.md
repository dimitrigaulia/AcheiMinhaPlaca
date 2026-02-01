# Implementação do Sistema de Cadastro e Inicialização Automática

Este plano detalha as etapas para implementar a criação automática do administrador, o formulário de cadastro completo, correções de robustez no envio de OTP e a modernização da interface pública.

## 1. Backend: Expansão de Entidades e Seeding
### 1.1 Atualizar Entidade `User`
*   **Adicionar campos:**
    *   `Cpf` (string, único)
    *   `PhoneNumber` (string)
    *   `BirthDate` (DateTime)
    *   `Address` (Entidade ou Value Object contendo: CEP, Logradouro, Número, Complemento, Bairro, Cidade, Estado)
    *   `TermsAccepted` (bool) e `TermsAcceptedAt` (DateTime)
*   **Migração:** Criar e aplicar migração do Entity Framework (`Add-Migration ExpandUserFields`).

### 1.2 Inicialização Automática (Seeding)
*   **Lógica:** Implementar verificador na inicialização da API (`Program.cs` ou serviço dedicado).
*   **Ação:** Verificar se o e-mail `dimitrifgaulia@gmail.com` existe. Se não, criar usuário com role `Admin` e dados padrão seguros.

## 2. Backend: Lógica de Negócio e Robustez
### 2.1 Atualizar `AuthService`
*   **Validação:** Implementar validação de formato de CPF e unicidade.
*   **DTOs:** Atualizar `RegisterDto` para receber todos os novos campos.
*   **Tratamento de Erros:** Melhorar as mensagens de retorno para falhas de validação.

### 2.2 Robustez no `OtpService`
*   **Dependência:** Adicionar biblioteca `Polly` para políticas de retry.
*   **Implementação:**
    *   Adicionar **Retry com Backoff Exponencial** para falhas temporárias no envio de código.
    *   Envolver chamada em `try/catch` com logs detalhados.
    *   Lançar exceções customizadas (`OtpServiceException`) com mensagens amigáveis para o usuário.

## 3. Frontend: Novo Formulário de Cadastro
### 3.1 Atualizar `RegisterComponent`
*   **Campos:** Adicionar inputs para CPF, Telefone, Endereço Completo, Data de Nascimento.
*   **Máscaras:** Implementar diretivas ou lógica para máscaras de CPF (`000.000.000-00`) e Telefone (`(00) 00000-0000`).
*   **Validação em Tempo Real:**
    *   CPF: Algoritmo de verificação de dígitos.
    *   Senha: Mínimo 8 chars, letras, números, especiais.
    *   CEP: Consulta automática (opcional para MVP, ou apenas validação de formato).
*   **Termos de Uso:** Checkbox obrigatório com link para modal/página de termos.

### 3.2 Redesign da Interface (UI/UX)
*   **Estilo:** Design moderno, limpo e responsivo (Mobile-First).
*   **Feedback:** Animações de loading, mensagens de erro inline e toasts de sucesso.
*   **Acessibilidade:** Garantir contraste, labels adequados e navegação por teclado (WCAG 2.1 AA).

## 4. Testes e Qualidade
*   **Backend:** Testes unitários para validação de CPF e lógica de criação de usuário.
*   **Frontend:** Testes unitários para o formulário de cadastro (validadores e submissão).
*   **Integração:** Verificar fluxo completo de cadastro -> login -> verificação de admin.

---
**Nota:** O erro "Erro ao solicitar código" será mitigado com a implementação do retry pattern e logs detalhados, permitindo identificar se é uma falha de rede ou lógica.
