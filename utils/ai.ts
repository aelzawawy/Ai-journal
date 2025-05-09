import { PromptTemplate } from '@langchain/core/prompts'
// import { ChatOpenAI } from '@langchain/openai'
import { BaseChain } from 'langchain/chains'
import { Document } from 'langchain/document'
import { StructuredOutputParser } from 'langchain/output_parsers'
// import { TensorFlowEmbeddings } from '@langchain/community/embeddings/tensorflow'
// import '@tensorflow/tfjs-backend-cpu'
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai'

import { ChainValues } from '@langchain/core/utils/types'
import { z } from 'zod'

// const model = new ChatOpenAI({
//   configuration: {
//     baseURL: 'https://openrouter.ai/api/v1',
//   },
//   model: 'gpt-3.5-turbo',
//   temperature: 0,
// })
const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.0-flash',
  temperature: 0,
})

// Using a zod schema for a cleaner output.
export const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    mood: z
      .string()
      .describe('The mood of the person who wrote the journal entry.'),
    summary: z.string().describe('A quick summary of the journal entry.'),
    subject: z.string().describe('The subject of the journal entry.'),
    sentimentScore: z.number().describe('The sentiment score of the journal entry and rated on a scale from -10 to 10 where -10 is extremly negative, 0 is neutral, and 10 id extremly positive.'),
    negative: z
      .boolean()
      .describe('Whether the journal entry had negative emotions.'),
    color: z
      .string()
      .describe(
        'A hexadecimal color code representing the mood of the journal entry.'
      ),
  })
)

// Generate a prompt with format instructions for the output parser
const getPrompt = async (journalEntry: string) => {
  const format_instructions = parser.getFormatInstructions()
  const prompt = new PromptTemplate({
    template:
      `Analyze the following journal entry.
      Follow the instructions and format your response to match the format instructions, no matter what! 
      Do not be creative if there is nothing to analyze.
      For the journal summary, give me a concise summary that speaks directly to me, adressing me directly using "you".
      \n\n{format_instructions}\n{entry}`,
    inputVariables: ['entry'],
    partialVariables: { format_instructions: format_instructions },
  })

  const input = await prompt.format({
    entry: journalEntry,
  })

  return input
}

export const analyze = async (journalEntry: string) => {
  try {
    const prompt = await getPrompt(journalEntry)
    const { content } = await model.invoke(prompt)

    return parser.parse(content as string)
  } catch (error: any) {
    throw new Error(`Analysis failed: ${error.error || error.message}`)
  }
}
interface QAJOURNAL {
  content: string
  id: string
  createdAt: Date
  updatedAt: Date
}

const customQAChain = (): BaseChain => {
  const prompt = new PromptTemplate({
    template: `You are a helpful AI assistant analyzing journal entries.
      Based on the following journal entries, please answer the question in a concise way.
      For entries written on ${new Date().toLocaleDateString(
        'en-US'
      )}, you can refer to them as "today's entry".
      For all other dates, use the full date.
      I wrote the journal entries, so you can talk directly to me.

      {context}

      Question: {question}`,

    inputVariables: ['context', 'question'],
  })

  return {
    invoke: async ({ question, context }: ChainValues) => {
      const formattedPrompt = await prompt.format({ context, question })
      const response = await model.invoke(formattedPrompt)
      return { output_text: response.content }
    },
  } as unknown as BaseChain
}
export const qa = async (question: string, journals: QAJOURNAL[]) => {
  try {
    // Turn the journals into langchain documents for the vector store
    const docs = journals.map((journal) => {
      return new Document({
        pageContent: journal.content,
        metadata: {
          id: journal.id,
          createdAt: journal.createdAt,
          updatedAt: journal.updatedAt,
        },
      })
    })

    // const QA_TEMPLATE = `You are a helpful AI assistant analyzing journal entries.
    // Based on the following journal entries, please answer the question.
    // Be direct and only provide the answer itself.
    // I wrote the journal entries, and each entry's date is provided in the context.
    // For entries written on ${today}, you can refer to them as "today's entry".
    // For all other dates, use the full date.

    // Context: {context}

    // Question: {question}`

    // const qaPrompt = new PromptTemplate({
    //   template: QA_TEMPLATE,
    //   inputVariables: ['context', 'question'],
    // })

    // This chain iterates over the documents and refines the answer with each document.
    // It uses previous answers and the next document as context.
    // Suitable for QA tasks where the answer is not in a single document.
    // const chain = loadQARefineChain(model, {
    //   questionPrompt: qaPrompt,
    //   refinePrompt: qaPrompt,
    // })

    const chain = customQAChain()
    // Returns a function that any chain can use to create embeddings
    // const embeddings = new TensorFlowEmbeddings()
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: 'text-embedding-004',
      // taskType: TaskType.SEMANTIC_SIMILARITY
    })

    // Create a simple in-memory vector store from the documents and embeddings
    // const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings)

    // const relevantDocs = await vectorStore.similaritySearch(question)

    const context = docs
      .map((doc) => {
        const date = new Date(doc.metadata.createdAt).toLocaleDateString(
          'en-US',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }
        )
        return `Journal entry written on ${date}:\n${doc.pageContent}`
      })
      .join('\n\n')

    const res = await chain.invoke({ question, context })

    return res.output_text
  } catch (error: any) {
    throw new Error(
      `Error occured! : ${
        error.error instanceof Object ? error.error : error.message
      }`
    )
  }
}
