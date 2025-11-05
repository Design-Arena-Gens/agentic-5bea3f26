'use client'

import { useState } from 'react'
import { Sparkles, MessageSquare, Settings, Copy, Download, RotateCcw } from 'lucide-react'

interface Question {
  id: string
  question: string
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'radio'
  options?: string[]
  placeholder?: string
}

interface Answer {
  [key: string]: string | string[]
}

const initialQuestions: Question[] = [
  {
    id: 'objective',
    question: 'Qual é o objetivo principal do seu prompt?',
    type: 'textarea',
    placeholder: 'Ex: Criar um assistente que ajuda a escrever artigos técnicos sobre programação'
  },
  {
    id: 'audience',
    question: 'Quem é o público-alvo?',
    type: 'select',
    options: ['Iniciantes', 'Intermediários', 'Avançados', 'Especialistas', 'Geral']
  },
  {
    id: 'tone',
    question: 'Qual tom de voz desejado?',
    type: 'multiselect',
    options: ['Profissional', 'Casual', 'Técnico', 'Amigável', 'Formal', 'Criativo', 'Educativo']
  },
  {
    id: 'format',
    question: 'Qual formato de saída esperado?',
    type: 'radio',
    options: ['Texto corrido', 'Lista com tópicos', 'Passo a passo', 'Código', 'Tabela', 'JSON', 'Markdown']
  },
  {
    id: 'length',
    question: 'Qual o tamanho ideal da resposta?',
    type: 'select',
    options: ['Muito curta (1-2 parágrafos)', 'Curta (3-5 parágrafos)', 'Média (6-10 parágrafos)', 'Longa (10+ parágrafos)', 'Flexível']
  },
  {
    id: 'context',
    question: 'Há algum contexto específico ou restrições que devem ser consideradas?',
    type: 'textarea',
    placeholder: 'Ex: Deve seguir as melhores práticas de SEO, evitar jargões técnicos, incluir exemplos práticos'
  },
  {
    id: 'examples',
    question: 'Deseja incluir exemplos no prompt?',
    type: 'radio',
    options: ['Sim, com exemplos detalhados', 'Sim, com exemplos simples', 'Não']
  },
  {
    id: 'constraints',
    question: 'Quais são as principais restrições ou o que deve ser evitado?',
    type: 'textarea',
    placeholder: 'Ex: Não usar gírias, evitar conteúdo controverso, manter neutralidade'
  }
]

export default function Home() {
  const [step, setStep] = useState<'welcome' | 'questions' | 'result'>('welcome')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer>({})
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])

  const currentQuestion = initialQuestions[currentQuestionIndex]

  const handleStart = () => {
    setStep('questions')
    setCurrentQuestionIndex(0)
    setAnswers({})
  }

  const handleAnswer = (value: string | string[]) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value }
    setAnswers(newAnswers)

    if (currentQuestionIndex < initialQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOptions([])
    } else {
      generatePrompt(newAnswers)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      const prevQuestion = initialQuestions[currentQuestionIndex - 1]
      if (prevQuestion.type === 'multiselect' && Array.isArray(answers[prevQuestion.id])) {
        setSelectedOptions(answers[prevQuestion.id] as string[])
      } else {
        setSelectedOptions([])
      }
    }
  }

  const toggleMultiselect = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    )
  }

  const generatePrompt = (finalAnswers: Answer) => {
    let prompt = `# Prompt Complexo Gerado\n\n`

    prompt += `## Objetivo\n${finalAnswers.objective}\n\n`

    prompt += `## Contexto e Especificações\n\n`

    prompt += `**Público-alvo:** ${finalAnswers.audience}\n\n`

    const toneArray = Array.isArray(finalAnswers.tone) ? finalAnswers.tone : [finalAnswers.tone]
    prompt += `**Tom de voz:** ${toneArray.join(', ')}\n\n`

    prompt += `**Formato de saída:** ${finalAnswers.format}\n\n`

    prompt += `**Tamanho esperado:** ${finalAnswers.length}\n\n`

    if (finalAnswers.context) {
      prompt += `## Contexto Adicional\n${finalAnswers.context}\n\n`
    }

    if (finalAnswers.constraints) {
      prompt += `## Restrições e Diretrizes\n${finalAnswers.constraints}\n\n`
    }

    prompt += `## Instruções de Execução\n\n`
    prompt += `Ao responder, você deve:\n\n`
    prompt += `1. Manter o tom ${toneArray.join(' e ')}\n`
    prompt += `2. Adaptar a linguagem para o nível ${finalAnswers.audience}\n`
    prompt += `3. Estruturar a resposta no formato: ${finalAnswers.format}\n`
    prompt += `4. Garantir que a resposta tenha ${finalAnswers.length}\n`

    if (finalAnswers.examples === 'Sim, com exemplos detalhados') {
      prompt += `5. Incluir exemplos práticos e detalhados para ilustrar cada ponto importante\n`
    } else if (finalAnswers.examples === 'Sim, com exemplos simples') {
      prompt += `5. Incluir exemplos simples quando apropriado\n`
    }

    prompt += `\n## Tarefa\n\n`
    prompt += `[INSIRA AQUI A TAREFA ESPECÍFICA QUE DESEJA QUE SEJA EXECUTADA]\n\n`
    prompt += `---\n\n`
    prompt += `*Este prompt foi gerado automaticamente pelo Construtor de Prompts Complexos*`

    setGeneratedPrompt(prompt)
    setStep('result')
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt)
    alert('Prompt copiado para a área de transferência!')
  }

  const downloadPrompt = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedPrompt], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = 'prompt-complexo.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const reset = () => {
    setStep('welcome')
    setCurrentQuestionIndex(0)
    setAnswers({})
    setGeneratedPrompt('')
    setSelectedOptions([])
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Screen */}
        {step === 'welcome' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 mt-10 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-16 h-16 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Construtor de Prompts Complexos
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
              Bem-vindo ao assistente inteligente para criação de prompts robustos e detalhados.
              Responda algumas perguntas e receba um prompt otimizado e pronto para uso.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center p-6 bg-purple-50 dark:bg-gray-700 rounded-xl">
                <MessageSquare className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-3" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Interativo</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Perguntas guiadas para capturar suas necessidades
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-blue-50 dark:bg-gray-700 rounded-xl">
                <Settings className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-3" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Dinâmico</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Adapta-se às suas respostas em tempo real
                </p>
              </div>
              <div className="flex flex-col items-center p-6 bg-pink-50 dark:bg-gray-700 rounded-xl">
                <Sparkles className="w-12 h-12 text-pink-600 dark:text-pink-400 mb-3" />
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Robusto</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Gera prompts completos e detalhados
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleStart}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-10 rounded-full text-lg shadow-lg transform transition hover:scale-105"
              >
                Começar Agora
              </button>
            </div>
          </div>
        )}

        {/* Questions Screen */}
        {step === 'questions' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 mt-10">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                  Pergunta {currentQuestionIndex + 1} de {initialQuestions.length}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(((currentQuestionIndex + 1) / initialQuestions.length) * 100)}% completo
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / initialQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-4">
              {currentQuestion.type === 'text' && (
                <div>
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none dark:bg-gray-700 dark:text-gray-100"
                    placeholder={currentQuestion.placeholder}
                    defaultValue={answers[currentQuestion.id] as string || ''}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        handleAnswer(e.currentTarget.value)
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      if (input.value) handleAnswer(input.value)
                    }}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {currentQuestion.type === 'textarea' && (
                <div>
                  <textarea
                    className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none h-32 dark:bg-gray-700 dark:text-gray-100"
                    placeholder={currentQuestion.placeholder}
                    defaultValue={answers[currentQuestion.id] as string || ''}
                  />
                  <button
                    onClick={(e) => {
                      const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement
                      if (textarea.value) handleAnswer(textarea.value)
                    }}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg"
                  >
                    Continuar
                  </button>
                </div>
              )}

              {currentQuestion.type === 'select' && (
                <div className="grid gap-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-700 transition text-left font-medium text-gray-700 dark:text-gray-200"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'radio' && (
                <div className="grid gap-3">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-gray-700 transition text-left font-medium text-gray-700 dark:text-gray-200"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'multiselect' && (
                <div>
                  <div className="grid gap-3 mb-4">
                    {currentQuestion.options?.map((option) => (
                      <button
                        key={option}
                        onClick={() => toggleMultiselect(option)}
                        className={`p-4 border-2 rounded-lg transition text-left font-medium ${
                          selectedOptions.includes(option)
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200'
                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-300 text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        <span className="mr-2">
                          {selectedOptions.includes(option) ? '✓' : '○'}
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handleAnswer(selectedOptions)}
                    disabled={selectedOptions.length === 0}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continuar
                  </button>
                </div>
              )}
            </div>

            {currentQuestionIndex > 0 && (
              <button
                onClick={handleBack}
                className="mt-6 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium"
              >
                ← Voltar
              </button>
            )}
          </div>
        )}

        {/* Result Screen */}
        {step === 'result' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 mt-10">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
              Seu Prompt Está Pronto!
            </h1>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 font-mono">
                {generatedPrompt}
              </pre>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                <Copy className="w-5 h-5" />
                Copiar Prompt
              </button>
              <button
                onClick={downloadPrompt}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                <Download className="w-5 h-5" />
                Baixar Arquivo
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                <RotateCcw className="w-5 h-5" />
                Criar Novo Prompt
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
