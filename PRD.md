# Product Requirements Document (PRD)

**Produto:** Gest Ultrassom - Agendamento Inteligente de Exames Pré-Natais

**Data:** [Data Atual]

**Versão:** 1.0

---

## 1. Resumo Executivo

O **Gest Ultrassom** é uma solução inovadora que automatiza e personaliza o agendamento de exames de ultrassonografia para gestantes da Clínica FMFLA em São Paulo. Através de uma integração inteligente com o WhatsApp, o produto resolve os principais pontos de dor das gestantes: a complexidade de saber quais exames fazer e quando, e a burocracia do agendamento. O aplicativo gera um calendário personalizado com base na idade gestacional, envia lembretes proativos e redireciona a paciente para finalizar o agendamento diretamente com a clínica via WhatsApp, garantindo precisão médica, fidelização e uma experiência superior de cuidado pré-natal.

---

## 2. Visão do Produto

Oferecer à gestante uma jornada pré-natal tranquila, organizada e segura, transformando a complexidade do agendamento de exames em uma experiência digital simples e proativa. Nosso objetivo é nos tornar o companheiro digital indispensável para toda gestante da Clínica FMFLA, aumentando a adesão ao cronograma de exames e fortalecendo o vínculo entre a paciente e a clínica.

---

## 3. Análise de Mercado e Oportunidade

*   **Problema do Mercado:** Gestantes frequentemente se sentem sobrecarregadas com a quantidade de informações e a responsabilidade de administrar um calendário complexo de exames médicos. Isso pode levar ao agendamento fora do período ideal, aumentando os riscos e diminuindo a eficácia do acompanhamento.

*   **Público-Alvo:** Gestantes da Clínica FMFLA, em sua maioria na região de São Paulo, com idade entre 25 e 45 anos, familiarizadas com aplicativos de mensagem e que buscam conveniência e cuidado especializado.

*   **Oportunidade:** Não existem no mercado soluções específicas que integrem o cálculo gestacional personalizado com o agendamento direto via canais de comunicação massificados como o WhatsApp. Esta integração é um diferencial único que atende a uma necessidade latente.

*   **Concorrência:** Soluções genéricas de agendamento médico e lembretes via SMS. O Gest Ultrassom se diferencia pela especialização no pré-natal, pela personalização extrema e pela integração fluida com o WhatsApp.

---

## 4. Personas

**Persona Primária: Carla**

*   **Idade:** 32 anos
*   **Ocupação:** Profissional de Marketing
*   **Localização:** São Paulo, SP
*   **Contexto:** Está na sua primeira gravidez, com 10 semanas. Está animada, mas também ansiosa e sobrecarregada com as informações. Tem uma rotina corrida e valoriza sua produtividade.

*   **Necessidades & Dores:**
    *   Esquecer as datas importantes dos exames.
    *   Não saber qual exame é necessário em cada fase.
    *   Perder tempo ligando para a clínica durante o horário comercial.
    *   Sentir insegurança sobre estar fazendo tudo corretamente para a saúde do bebê.

*   **Objetivos:**
    *   Ter um guia claro e confiável da sua gravidez.
    *   Automatizar o agendamento de forma rápida e sem estresse.
    *   Sentir-se segura e bem cuidada pela clínica.

---

## 5. Histórias de Usuário (User Stories)

**Épico: Onboarding e Configuração Inicial**
*   **Como** Carla, uma gestante,
*   **Quero** informar minha Data da Última Menstruação (DUM) ou a Data Provável do Parto (DPP),
*   **Para que** o aplicativo calcule automaticamente minha idade gestacional e crie um calendário personalizado de exames.

**Épico: Gestão de Lembretes**
*   **Como** Carla,
*   **Quero** receber notificações automáticas algumas semanas antes da janela ideal para cada exame,
*   **Para que** eu tenha tempo suficiente para me organizar e agendar sem pressa.

**Épico: Agendamento Simplificado**
*   **Como** Carla,
*   **Quero** poder tocar em um botão que me redirecione diretamente para o WhatsApp da clínica, já com uma mensagem pré-formatada contendo meu nome e o exame que desejo agendar,
*   **Para que** o processo de confirmação seja instantâneo e eu não precise repetir minhas informações.

**Épico: Acompanhamento da Jornada**
*   **Como** Carla,
*   **Quero** visualizar em um único lugar todo o meu cronograma de exames, incluindo os já realizados e os próximos,
*   **Para que** eu tenha uma visão clara do meu progresso no pré-natal.

---

## 6. Funcionalidades Detalhadas

**6.1. Módulo de Cadastro e Perfil Gestacional**
*   Coleta de dados iniciais: Nome, DUM/DPP.
*   Cálculo automático e em tempo real da Idade Gestacional (IG) e DPP.
*   Armazenamento seguro do perfil.

**6.2. Módulo do Calendário e Cronograma Inteligente**
*   Geração automática de um cronograma visual baseado no protocolo médico da clínica.
*   Exibição clara de cada exame, sua janela ideal (ex: 22-24 semanas) e uma breve descrição de sua finalidade.
*   Marcação de exames já realizados (feita pela própria usuária ou via integração futura).

**6.3. Módulo de Notificações e Lembretes**
*   Sistema de notificações push configurado para disparar 2 semanas antes do início da janela ideal para cada exame.
*   Mensagens personalizadas: "Olá, Carla! Está se aproximando a hora do seu ultrassom morfológico do 2º trimestre (ideal entre 22-24 semanas). Clique aqui para agendar!"
*   Controle de frequência para não sobrecarregar a usuária.

**6.4. Módulo de Integração com WhatsApp**
*   Botão de "Agendar Este Exame" em cada item do cronograma.
*   Ao clicar, o usuário é redirecionado para uma conversa no WhatsApp com o número oficial da Clínica FMFLA.
*   Mensagem automática pré-formatada: "Olá, sou a Carla [ID: 12345]. Gostaria de agendar o *Ultrassom Morfológico do 2º Trimestre*, previsto para a minha 22ª semana."

---

## 7. Requisitos Técnicos

*   **Plataforma:** Aplicativo nativo para iOS e Android, ou Progressive Web App (PWA) para maior agilidade no lançamento.
*   **Backend:** API RESTful para gerenciar usuários, perfis gestacionais e o cronograma.
*   **Integrações:**
    *   **API do WhatsApp:** Para deep linking e pré-preenchimento de mensagens.
    *   **Serviço de Notificações Push:** Firebase Cloud Messaging (FCM) para Android e Apple Push Notification Service (APNs) para iOS.
*   **Algoritmo:** Lógica de negócio robusta para o cálculo gestacional e para a geração dinâmica do cronograma de exames.
*   **Segurança:** Criptografia de dados em repouso e em trânsito. Conformidade com a LGPD para o armazenamento de dados de saúde.
*   **Banco de Dados:** Banco de dados relacional (ex: PostgreSQL) ou não-relacional (ex: MongoDB) para escalabilidade.

---

## 8. Diretrizes de UI/UX

*   **Princípios:** Simplicidade, Clareza e Empatia.
*   **Tom de Voz:** Acolhedor, informativo e tranquilizador.
*   **Paleta de Cores:** Cores suaves e calmantes (tons de azul claro, verde água, lilás). Evitar cores agressivas.
*   **Design de Interface:**
    *   Ênfase visual no calendário gestacional e nos próximos passos.
    *   Ícones intuitivos para representar diferentes tipos de exame.
    *   Botões de chamada para ação (CTAs) evidentes, como o botão de agendamento via WhatsApp.
    *   Navegação por abas inferior ou lateral simples (ex: "Minha Jornada", "Meu Cronograma", "Meu Perfil").
*   **Acessibilidade:** Suporte a leitores de tela, contraste adequado de cores e tipografia legível.

---

## 9. Métricas de Sucesso

*   **Métricas de Engajamento:**
    *   Taxa de ativação: % de usuárias que completam o cadastro e visualizam o cronograma.
    *   Taxa de retenção: % de usuárias que retornam ao app após 7 e 30 dias.
    *   Número de notificações visualizadas/clicadas.
*   **Métricas de Negócio:**
    *   Taxa de conversão de agendamento: % de notificações que resultam em um agendamento via WhatsApp.
    *   Redução no número de agendamentos fora da janela ideal.
    *   Aumento na satisfação da paciente (a ser medido via pesquisa NPS pós-uso).
    *   Tempo médio economizado pela equipe da clínica com agendamentos.

---

## 10. Cronograma e Fases de Lançamento

**Fase 1: MVP (Produto Mínimo Viável) - 2-3 meses**
*   Escopo: Cadastro, cálculo gestacional, cronograma estático (não editável), integração básica com WhatsApp (redirecionamento com mensagem fixa).
*   Objetivo: Validar o conceito principal com um grupo fechado de gestantes da clínica.

**Fase 2: Notificações e Refinamentos - 1-2 meses**
*   Escopo: Implementação do sistema de notificações push inteligentes. Melhorias na UI/UX baseadas no feedback do MVP.
*   Objetivo: Aumentar a proatividade do sistema e o engajamento.

**Fase 3: Lançamento Oficial - 1 mês**
*   Escopo: Polimento final, testes de carga e segurança. Lançamento público para todas as gestantes da Clínica FMFLA.
*   Objetivo: Escalar a solução e começar a coleta de métricas em larga escala.

**Futuro (Fase 4):**
*   Integração com a agenda interna da clínica.
*   Portal para o médico atualizar o status dos exames.
*   Conteúdo educativo sobre cada fase da gravidez.


